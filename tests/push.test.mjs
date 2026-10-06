import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("../src/push.sh", import.meta.url));
const marker = "injection-marker";
const mockGit = `#!/usr/bin/env node
const fs = require("node:fs");
const args = process.argv.slice(2);
fs.appendFileSync(process.env.MOCK_GIT_LOG, JSON.stringify(args) + "\\n");
const status = args[0] === "commit" ? process.env.MOCK_COMMIT_STATUS
  : args[0] === "push" ? process.env.MOCK_PUSH_STATUS : 0;
process.exit(Number(status || 0));
`;

function runPush(t, overrides = {}) {
  const directory = mkdtempSync(join(tmpdir(), "diff-pr-push-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const bin = join(directory, "bin");
  const log = join(directory, "git.jsonl");
  mkdirSync(bin);
  writeFileSync(join(bin, "git"), mockGit, { mode: 0o755 });
  const env = {
    PATH: [bin, dirname(process.execPath), "/usr/bin", "/bin"].join(delimiter),
    MOCK_GIT_LOG: log,
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
    if (env[key] === undefined) delete env[key];
  }
  const result = spawnSync("bash", [script], {
    cwd: directory,
    env,
    encoding: "utf8",
  });
  assert.ifError(result.error);
  const calls = readFileSync(log, "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  return {
    ...result,
    calls,
    env,
    markerExists: existsSync(join(directory, marker)),
  };
}

function expectedCalls(env) {
  const options = env.NO_VERIFY === "true" ? ["--no-verify"] : [];
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

for (const value of ["false", "true", undefined, "TRUE"]) {
  test(`preserves git arguments with NO_VERIFY=${value}`, (t) => {
    const result = runPush(t, { NO_VERIFY: value });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(result.calls, expectedCalls(result.env));
  });
}

const payloads = [
  `poc-$(printf\${IFS}PROOF>${marker})`,
  `poc-\`printf\${IFS}PROOF>${marker}\``,
  `poc";printf\${IFS}PROOF>${marker};#`,
];

for (const field of ["HEAD_REF", "BRANCH_NAME_PREFIX", "PR_TITLE_PREFIX"]) {
  for (const [index, payload] of payloads.entries()) {
    for (const noVerify of ["false", "true"]) {
      test(`${field} payload ${index + 1} stays literal with NO_VERIFY=${noVerify}`, (t) => {
        execFileSync("git", ["check-ref-format", "--branch", payload], {
          encoding: "utf8",
        });
        const result = runPush(t, {
          [field]: payload,
          NO_VERIFY: noVerify,
        });
        assert.equal(result.status, 0, result.stderr);
        assert.equal(result.markerExists, false);
        assert.deepEqual(result.calls, expectedCalls(result.env));
      });
    }
  }
}

for (const title of ["", 'A "quoted" title with spaces\nand a newline']) {
  test(`preserves the commit title ${JSON.stringify(title)}`, (t) => {
    const result = runPush(t, { PR_TITLE_PREFIX: title });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(result.calls, expectedCalls(result.env));
  });
}

test("does not push after a failed commit", (t) => {
  const result = runPush(t, { MOCK_COMMIT_STATUS: "17" });
  assert.equal(result.status, 17);
  assert.deepEqual(result.calls, expectedCalls(result.env).slice(0, 3));
});

test("propagates push failure without executing the branch name", (t) => {
  const result = runPush(t, {
    HEAD_REF: payloads[0],
    MOCK_PUSH_STATUS: "23",
  });
  assert.equal(result.status, 23);
  assert.equal(result.markerExists, false);
  assert.deepEqual(result.calls, expectedCalls(result.env));
});
