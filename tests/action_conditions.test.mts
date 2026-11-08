import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

// action.yml の各stepの if を、GitHub Actionsの式の一部 (比較、論理演算、プロパティ参照) として評価し、
// イベントごとにどのstepが実行されるかを確かめる

type Step = {
  name?: string;
  id?: string;
  if?: string;
  env?: Record<string, string>;
};
type Value = string | number | boolean | null | { [key: string]: Value };

const action = load(
  readFileSync(
    fileURLToPath(new URL("../action.yml", import.meta.url)),
    "utf8",
  ),
) as { runs: { steps: Step[] } };
const steps: Step[] = action.runs.steps;

function tokenize(expression: string): string[] {
  const tokens: string[] = [];
  const pattern: RegExp =
    /\s*('(?:[^']|'')*'|==|!=|&&|\|\||!|\(|\)|[A-Za-z0-9_\-.[\]]+)/y;
  let match: RegExpExecArray | null;

  while (pattern.lastIndex < expression.length) {
    match = pattern.exec(expression);
    assert.ok(match, `unexpected token in: ${expression}`);
    tokens.push(match[1]);
    if (/^\s*$/.test(expression.slice(pattern.lastIndex))) {
      break;
    }
  }

  return tokens;
}

function toNumber(value: Value): number {
  if (value === null || value === "") {
    return 0;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  if (typeof value === "object") {
    return NaN;
  }
  return Number(value);
}

function equals(left: Value, right: Value): boolean {
  if (typeof left === "string" && typeof right === "string") {
    return left.toLowerCase() === right.toLowerCase();
  }
  return toNumber(left) === toNumber(right);
}

function truthy(value: Value): boolean {
  return !(
    value === null ||
    value === false ||
    value === "" ||
    (typeof value === "number" && (value === 0 || Number.isNaN(value)))
  );
}

function evaluate(expression: string, context: Value): Value {
  const tokens: string[] = tokenize(expression);
  let position: number = 0;

  const peek = (): string | undefined => tokens[position];
  const next = (): string => tokens[position++];

  function primary(): Value {
    const token: string = next();
    if (token === "(") {
      const value: Value = or();
      assert.equal(next(), ")");
      return value;
    }
    if (token === "!") {
      return !truthy(primary());
    }
    if (token.startsWith("'")) {
      return token.slice(1, -1).replaceAll("''", "'");
    }
    if (/^[0-9]+$/.test(token)) {
      return Number(token);
    }
    if (token === "true" || token === "false") {
      return token === "true";
    }
    let value: Value = context;
    for (const key of token.split(".")) {
      value =
        value !== null && typeof value === "object"
          ? (value[key] ?? null)
          : null;
    }
    return value;
  }

  function comparison(): Value {
    let left: Value = primary();
    while (peek() === "==" || peek() === "!=") {
      const operator: string = next();
      const right: Value = primary();
      left = operator === "==" ? equals(left, right) : !equals(left, right);
    }
    return left;
  }

  function and(): Value {
    let left: Value = comparison();
    while (peek() === "&&") {
      next();
      const right: Value = comparison();
      left = truthy(left) ? right : left;
    }
    return left;
  }

  function or(): Value {
    let left: Value = and();
    while (peek() === "||") {
      next();
      const right: Value = and();
      left = truthy(left) ? left : right;
    }
    return left;
  }

  const value: Value = or();
  assert.equal(position, tokens.length, `unparsed tokens in: ${expression}`);
  return value;
}

type Scenario = {
  eventName: string;
  action?: string;
  headRepo?: string | null;
  diff: boolean;
  exitFailure?: string;
  numberOfPullRequests?: number;
};

const repository: string = "test-owner/test-repo";

// シナリオで実行されるstepの名前を、action.yml の順に返す
function runSteps(scenario: Scenario): string[] {
  const context: Value = {
    github: {
      event_name: scenario.eventName,
      repository,
      event: {
        action: scenario.action ?? null,
        pull_request:
          scenario.eventName === "pull_request"
            ? {
                user: { login: "someone" },
                head: {
                  repo:
                    scenario.headRepo === null
                      ? null
                      : { full_name: scenario.headRepo ?? repository },
                },
              }
            : null,
      },
    },
    inputs: { "exit-failure": scenario.exitFailure ?? "true" },
    steps: {
      diff: { outputs: { result: scenario.diff ? "差分あり" : "" } },
      get_number_of_pull_requests: {
        outputs: { result: String(scenario.numberOfPullRequests ?? 0) },
      },
    },
  };
  // forkからのPRかを判定するstepの出力は、そのstepのenvの式を評価した値とする
  const forkStep: Step | undefined = steps.find(
    (step: Step) => step.id === "fork",
  );
  const forkExpression: string | undefined = forkStep?.env?.IS_FORK_PR;
  if (forkExpression !== undefined) {
    const match: RegExpMatchArray | null =
      forkExpression.match(/^\$\{\{(.*)\}\}$/s);
    assert.ok(match, forkExpression);
    (context as any).steps.fork = {
      outputs: { "is-fork-pr": String(evaluate(match[1], context)) },
    };
  }
  return steps
    .filter(
      (step: Step) =>
        step.if === undefined || truthy(evaluate(step.if, context)),
    )
    .map((step: Step) => step.name ?? step.id ?? "");
}

// 書き込み権限が必要なstepと、それらが使う環境変数を設定するstep
const writeSteps: string[] = [
  "Set env",
  "Push",
  "Get a number of PullRequests",
  "Create PullRequest",
  "Assign a user",
  "Update PullRequest",
  "Close PullRequest",
];

function writes(names: string[]): string[] {
  return names.filter((name: string) => writeSteps.includes(name));
}

const forkRepos: (string | null)[] = ["someone/test-repo", null];

for (const headRepo of forkRepos) {
  for (const exitFailure of ["true", "false"]) {
    test(`fails without writing on a diff from a fork PR (head repo ${headRepo}, exit-failure ${exitFailure})`, () => {
      const names: string[] = runSteps({
        eventName: "pull_request",
        action: "synchronize",
        headRepo,
        diff: true,
        exitFailure,
      });
      assert.deepEqual(writes(names), []);
      assert.ok(names.includes("Exit"), names.join(", "));
    });
  }

  test(`passes without writing on no diff from a fork PR (head repo ${headRepo})`, () => {
    const names: string[] = runSteps({
      eventName: "pull_request",
      action: "synchronize",
      headRepo,
      diff: false,
    });
    assert.deepEqual(writes(names), []);
    assert.ok(!names.includes("Exit"), names.join(", "));
  });

  test(`does not write when a fork PR is closed (head repo ${headRepo})`, () => {
    const names: string[] = runSteps({
      eventName: "pull_request",
      action: "closed",
      headRepo,
      diff: false,
    });
    assert.deepEqual(writes(names), []);
    assert.ok(!names.includes("Exit"), names.join(", "));
  });
}

test("creates a fix PR on a diff from a PR in the same repository", () => {
  const names: string[] = runSteps({
    eventName: "pull_request",
    action: "synchronize",
    diff: true,
  });
  assert.deepEqual(writes(names), writeSteps.slice(0, 6));
  assert.ok(names.includes("Exit"));
});

test("closes the fix PR when a PR in the same repository has no diff", () => {
  const names: string[] = runSteps({
    eventName: "pull_request",
    action: "synchronize",
    diff: false,
  });
  assert.deepEqual(writes(names), ["Set env", "Close PullRequest"]);
});

test("closes the fix PR when a PR in the same repository is closed", () => {
  const names: string[] = runSteps({
    eventName: "pull_request",
    action: "closed",
    diff: false,
  });
  assert.deepEqual(writes(names), ["Set env", "Close PullRequest"]);
  assert.ok(!names.includes("Exit"));
});

test("does not fail with exit-failure false on a PR in the same repository", () => {
  const names: string[] = runSteps({
    eventName: "pull_request",
    action: "synchronize",
    diff: true,
    exitFailure: "false",
  });
  assert.ok(!names.includes("Exit"));
});

for (const eventName of [
  "push",
  "schedule",
  "workflow_dispatch",
  "repository_dispatch",
]) {
  test(`creates a fix PR on a diff with ${eventName}`, () => {
    const names: string[] = runSteps({ eventName, diff: true });
    assert.deepEqual(writes(names), [
      "Set env",
      "Push",
      "Get a number of PullRequests",
      "Create PullRequest",
      "Update PullRequest",
    ]);
  });

  test(`does not fail with exit-failure false and ${eventName}`, () => {
    const names: string[] = runSteps({
      eventName,
      diff: true,
      exitFailure: "false",
    });
    assert.ok(!names.includes("Exit"));
  });
}
