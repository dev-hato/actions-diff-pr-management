import type { SpawnSyncReturns } from "node:child_process";
import type { TestContext } from "node:test";
import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

// action.yml の runs.steps の要素のうち、このテストで使う項目
type Step = {
  id?: string;
  run?: string;
};

// 改行を含む入力によって注入を試みる環境変数
// 実際の攻撃では、後続の bash ステップで任意のスクリプトを読み込ませるために使われる
const injectedKey: string = "BASH_ENV";

// 1行目は正規の値、2行目で injectedKey を定義させるペイロード
const payload: string = `fix\n${injectedKey}=/tmp/injected-bash-env`;

// null を除いたオブジェクトかどうか（in 演算子を安全に使うための前提）
function isObject(value: unknown): value is object {
  return value !== null && typeof value === "object";
}

// id と run が存在する場合は文字列であることを確認する
function isStep(value: unknown): value is Step {
  return (
    isObject(value) &&
    (!("id" in value) || typeof value.id === "string") &&
    (!("run" in value) || typeof value.run === "string")
  );
}

// action.yml の読み込み結果が runs.steps の配列を持つことを確認する
function isAction(value: unknown): value is { runs: { steps: Step[] } } {
  return (
    isObject(value) &&
    "runs" in value &&
    isObject(value.runs) &&
    "steps" in value.runs &&
    Array.isArray(value.runs.steps) &&
    value.runs.steps.every(isStep)
  );
}

// action.yml から Set env ステップの run スクリプトを取り出す
// 実物のスクリプトを使うことで、action.yml の修正がそのままテストに反映される
function loadSetEnvScript(): string {
  const action: unknown = load(
    readFileSync(
      fileURLToPath(new URL("../action.yml", import.meta.url)),
      "utf8",
    ),
  );
  assert.ok(isAction(action), "action.yml must have runs.steps");
  const step: Step | undefined = action.runs.steps.find(
    (s: Step): boolean => s.id === "set-env",
  );
  assert.ok(step?.run !== undefined, "set-env step must have a run script");
  return step.run;
}

// GitHub Actions runner と同じ規則で GITHUB_ENV ファイルを解釈する
function parseGithubEnv(content: string): Map<string, string> {
  const result: Map<string, string> = new Map();
  const lines: string[] = content.split("\n");

  for (let i: number = 0; i < lines.length; i++) {
    const line: string = lines[i];

    // 空行は無視する
    if (line === "") {
      continue;
    }

    const equalsIndex: number = line.indexOf("=");
    const heredocIndex: number = line.indexOf("<<");

    // `KEY=VALUE` 形式（`=` が `<<` より前にある）
    if (equalsIndex >= 0 && (heredocIndex < 0 || equalsIndex < heredocIndex)) {
      result.set(line.slice(0, equalsIndex), line.slice(equalsIndex + 1));
      continue;
    }

    // `KEY<<DELIMITER` 形式：次の行から DELIMITER の行までが値になる
    assert.ok(heredocIndex > 0, `invalid GITHUB_ENV line: ${line}`);
    const key: string = line.slice(0, heredocIndex);
    const delimiter: string = line.slice(heredocIndex + 2);
    const value: string[] = [];
    i++;

    while (i < lines.length && lines[i] !== delimiter) {
      value.push(lines[i]);
      i++;
    }

    assert.ok(i < lines.length, `missing delimiter for ${key}`);
    result.set(key, value.join("\n"));
  }

  return result;
}

// Set env ステップを一時ディレクトリで実行し、GITHUB_ENV に書き込まれた環境変数を返す
// overrides でステップに渡す環境変数（inputs 由来の値）を上書きできる
function runSetEnv(
  t: TestContext,
  overrides: NodeJS.ProcessEnv,
): Map<string, string> {
  const cwd: string = mkdtempSync(join(tmpdir(), "diff-pr-set-env-test-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  // runner の GITHUB_ENV ファイルの代わりに使う空ファイル
  const GITHUB_ENV: string = join(cwd, "github_env");
  writeFileSync(GITHUB_ENV, "");
  const result: SpawnSyncReturns<string> = spawnSync(
    "bash",
    ["-e", "-c", loadSetEnvScript()],
    {
      cwd,
      env: {
        PATH: process.env.PATH,
        GITHUB_ENV,
        // action.yml の Set env ステップの env に相当する値
        HEAD_REF: "feature/test",
        PR_DESCRIPTION_PREFIX_VALUE: "",
        PR_NUMBER: "1",
        PR_TITLE_PREFIX: "fix",
        PR_LABELS: "",
        BRANCH_NAME_PREFIX: "fix",
        ...overrides,
      },
      encoding: "utf8",
    },
  );
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  return parseGithubEnv(readFileSync(GITHUB_ENV, "utf8"));
}

// PR_DESCRIPTION_PREFIX は以前からランダムな delimiter で書き込まれており、注入されない
test("PR_DESCRIPTION_PREFIX with a newline does not inject env", (t: TestContext) => {
  const env: Map<string, string> = runSetEnv(t, {
    PR_DESCRIPTION_PREFIX_VALUE: payload,
  });
  assert.equal(env.get("PR_DESCRIPTION_PREFIX"), payload);
  assert.equal(env.has(injectedKey), false);
});

// 回帰テスト： `KEY=VALUE` 形式で書き込まれていたため、改行以降が別の環境変数として解釈されていた
for (const field of ["PR_TITLE_PREFIX", "PR_LABELS", "BRANCH_NAME_PREFIX"]) {
  test(`${field} with a newline does not inject env`, (t: TestContext) => {
    const env: Map<string, string> = runSetEnv(t, { [field]: payload });
    assert.equal(env.has(injectedKey), false, `${injectedKey} was injected`);
    assert.equal(env.get(field), payload);
  });
}
