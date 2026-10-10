import type { SpawnSyncReturns } from "node:child_process";
import type { TestContext } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

type PushResult = SpawnSyncReturns<string> & {
  calls: string[][];
  env: NodeJS.ProcessEnv;
  markerExists: boolean;
};

const script: string = resolvePath("../src/push.sh");
const marker: string = "injection-marker";
const mockGit: string = resolvePath("./mock_git.mts");
const mockGitWrapper: string = resolvePath("./mock_git.sh");

function resolvePath(path: string): string {
  return fileURLToPath(new URL(path, import.meta.url));
}

function isStringArray(value: any): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item): item is string => typeof item === "string")
  );
}

function runPush(
  t: TestContext,
  overrides: NodeJS.ProcessEnv = {},
): PushResult {
  const directory: string = mkdtempSync(join(tmpdir(), "diff-pr-push-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const bin: string = join(directory, "bin");
  const log: string = join(directory, "git.jsonl");
  mkdirSync(bin);
  copyFileSync(mockGitWrapper, join(bin, "git"));
  const env: NodeJS.ProcessEnv = {
    PATH: [bin, dirname(process.execPath), "/usr/bin", "/bin"].join(delimiter),
    MOCK_GIT_LOG: log,
    MOCK_GIT_SCRIPT: mockGit,
    GITHUB_ACTOR: "test-actor",
    TOKEN: "dummy-token",
    GITHUB_REPOSITORY: "test-owner/test-repo",
    BRANCH_NAME_PREFIX: "fix",
    HEAD_REF: "feature/test",
    PR_TITLE_PREFIX: "Update snapshots",
    NO_VERIFY: "false",
    ...overrides,
  };
  for (const key of Object.keys(env)) {
    if (env[key] === undefined) {
      delete env[key];
    }
  }
  const result: SpawnSyncReturns<string> = spawnSync("bash", [script], {
    cwd: directory,
    env,
    encoding: "utf8",
  });
  assert.ifError(result.error);
  const calls: string[][] = readFileSync(log, "utf8")
    .trim()
    .split("\n")
    .map((line: string): string[] => {
      const call = JSON.parse(line);
      assert.ok(isStringArray(call), `unexpected git log line: ${line}`);
      return call;
    });
  return {
    ...result,
    calls,
    env,
    markerExists: existsSync(join(directory, marker)),
  };
}

function expectedCalls(env: NodeJS.ProcessEnv): string[][] {
  const options: string[] = env.NO_VERIFY === "true" ? ["--no-verify"] : [];
  assert.ok(env.PR_TITLE_PREFIX !== undefined, "PR_TITLE_PREFIX must be set");
  return [
    ["config", "user.name", "github-actions[bot]"],
    [
      "config",
      "user.email",
      "41898282+github-actions[bot]@users.noreply.github.com",
    ],
    ["commit", ...options, "-m", env.PR_TITLE_PREFIX],
    [
      "push",
      ...options,
      "-f",
      `https://${env.GITHUB_ACTOR}:${env.TOKEN}@github.com/${env.GITHUB_REPOSITORY}.git`,
      `HEAD:refs/heads/${env.BRANCH_NAME_PREFIX}-${env.HEAD_REF}`,
    ],
  ];
}

function assertPushFailed(
  result: PushResult,
  expectedStatus: number,
  calls: string[][] = expectedCalls(result.env),
) {
  assert.equal(result.status, expectedStatus);
  assert.deepEqual(result.calls, calls);
}

function assertPushSucceeded(result: PushResult) {
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.calls, expectedCalls(result.env));
}

for (const value of ["false", "true", undefined, "TRUE"]) {
  test(`preserves git arguments with NO_VERIFY=${value}`, (t: TestContext) =>
    assertPushSucceeded(runPush(t, { NO_VERIFY: value })));
}

const payloads: string[] = [
  `poc-$(printf\${IFS}PROOF>${marker})`,
  `poc-\`printf\${IFS}PROOF>${marker}\``,
  `poc";printf\${IFS}PROOF>${marker};#`,
];

for (const field of ["HEAD_REF", "BRANCH_NAME_PREFIX", "PR_TITLE_PREFIX"]) {
  for (const [index, payload] of payloads.entries()) {
    for (const noVerify of ["false", "true"]) {
      test(`${field} payload ${index + 1} stays literal with NO_VERIFY=${noVerify}`, (t: TestContext) => {
        execFileSync("git", ["check-ref-format", "--branch", payload], {
          encoding: "utf8",
        });
        const result: PushResult = runPush(t, {
          [field]: payload,
          NO_VERIFY: noVerify,
        });
        assertPushSucceeded(result);
        assert.equal(result.markerExists, false);
      });
    }
  }
}

for (const title of ["", 'A "quoted" title with spaces\nand a newline']) {
  test(`preserves the commit title ${JSON.stringify(title)}`, (t: TestContext) =>
    assertPushSucceeded(runPush(t, { PR_TITLE_PREFIX: title })));
}

test("does not push after a failed commit", (t: TestContext) => {
  const mockCommitStatus: number = 17;
  const result: PushResult = runPush(t, {
    MOCK_COMMIT_STATUS: String(mockCommitStatus),
  });
  assertPushFailed(
    result,
    mockCommitStatus,
    expectedCalls(result.env).slice(0, 3),
  );
});

test("propagates push failure without executing the branch name", (t: TestContext) => {
  const mockPushStatus: number = 23;
  const result: PushResult = runPush(t, {
    HEAD_REF: payloads[0],
    MOCK_PUSH_STATUS: String(mockPushStatus),
  });
  assertPushFailed(result, mockPushStatus);
  assert.equal(result.markerExists, false);
});
