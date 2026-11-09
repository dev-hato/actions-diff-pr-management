import type { SpawnSyncReturns } from "node:child_process";
import type { TestContext } from "node:test";
import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const script: string = fileURLToPath(
  new URL("../src/detect_diff.sh", import.meta.url),
);

type DetectResult = SpawnSyncReturns<string> & { output: string };

// コミット済みのファイルを持つgitリポジトリで、changeで作業ツリーを変更してからdetect_diff.shを実行する
// isForkPrは、forkからのPRかどうかを表すIS_FORK_PR環境変数の値 (nullの場合は設定しない)
function runDetect(
  t: TestContext,
  change: (directory: string) => void,
  isForkPr: string | null = "true",
): DetectResult {
  const directory: string = mkdtempSync(join(tmpdir(), "diff-pr-detect-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const env: NodeJS.ProcessEnv = {
    PATH: process.env.PATH,
    HOME: directory,
    GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_AUTHOR_NAME: "test",
    GIT_AUTHOR_EMAIL: "test@example.com",
    GIT_COMMITTER_NAME: "test",
    GIT_COMMITTER_EMAIL: "test@example.com",
    GITHUB_OUTPUT: join(directory, ".github_output"),
  };
  if (isForkPr !== null) {
    env.IS_FORK_PR = isForkPr;
  }
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: directory, env, encoding: "utf8" });
  git("init", "-q");
  writeFileSync(join(directory, "a.txt"), "before\n");
  writeFileSync(join(directory, ".gitignore"), ".github_output\n");
  git("add", "-A");
  git("commit", "-q", "-m", "init");
  change(directory);
  const result: SpawnSyncReturns<string> = spawnSync("bash", [script], {
    cwd: directory,
    env,
    encoding: "utf8",
  });
  assert.ifError(result.error);
  return { ...result, output: readFileSync(env.GITHUB_OUTPUT!, "utf8") };
}

test("outputs nothing as the result when there is no diff", (t: TestContext) => {
  const result: DetectResult = runDetect(t, () => {});
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.output, "result=\n");
  assert.doesNotMatch(result.stdout, /diff --git/);
});

test("prints the diff when there is a diff in a fork PR", (t: TestContext) => {
  const result: DetectResult = runDetect(t, (directory: string) => {
    writeFileSync(join(directory, "a.txt"), "after\n");
    writeFileSync(join(directory, "new.txt"), "added\n");
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.output, "result=差分あり\n");
  assert.match(result.stdout, /^diff --git a\/a\.txt b\/a\.txt$/m);
  assert.match(result.stdout, /^-before$/m);
  assert.match(result.stdout, /^\+after$/m);
  assert.match(result.stdout, /^\+added$/m);
});

// 差分に含まれる文字列がワークフローコマンドとして解釈されないよう、
// ::stop-commands:: で囲んで出力する
test("prints the diff with workflow commands stopped", (t: TestContext) => {
  const result: DetectResult = runDetect(t, (directory: string) => {
    writeFileSync(join(directory, "a.txt"), "::error::injected\n");
  });
  assert.equal(result.status, 0, result.stderr);
  const lines: string[] = result.stdout.split("\n");
  const start: number = lines.findIndex((line: string) =>
    line.startsWith("::stop-commands::"),
  );
  assert.notEqual(start, -1, result.stdout);
  const token: string = lines[start].slice("::stop-commands::".length);
  assert.match(token, /^[0-9a-f]{32}$/);
  const end: number = lines.indexOf(`::${token}::`);
  assert.ok(end > start, result.stdout);
  const injected: number = lines.findIndex((line: string) =>
    line.includes("::error::injected"),
  );
  assert.ok(start < injected && injected < end, result.stdout);
  // 差分以外の行は、stop-commandsの開始と終了だけである
  assert.deepEqual(
    lines.filter(
      (line: string, index: number) =>
        line.startsWith("::") && index !== start && index !== end,
    ),
    [],
  );
});

// 差分の出力は時間がかかりログも増えるため、修正PRで差分を確認できるforkからでないPRなどでは出力しない
for (const isForkPr of ["false", "", null]) {
  test(`does not print the diff with IS_FORK_PR=${isForkPr}`, (t: TestContext) => {
    const result: DetectResult = runDetect(
      t,
      (directory: string) => writeFileSync(join(directory, "a.txt"), "after\n"),
      isForkPr,
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.output, "result=差分あり\n");
    assert.equal(result.stdout, "");
  });
}
