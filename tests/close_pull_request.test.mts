import type { TestContext } from "node:test";
import type { GitHub } from "@actions/github/lib/utils";
import assert from "node:assert/strict";
import test from "node:test";
import { context, getOctokit } from "@actions/github";
import { tsImport } from "tsx/esm/api";

// src を tsx で読み込む (src は拡張子なしの import を使っているため、node 単体では読み込めない)
const { script } = await tsImport(
  "../src/close_pull_request.ts",
  import.meta.url,
);

// 呼び出された API のメソッド、パス、リクエストボディ
type ApiCall = [string, string, unknown];

type MockGitHubOptions = {
  repository: string;
  pulls: {
    number: number;
    head: { sha: string };
  }[];
  committerEmails: Record<string, string>;
};

type RunCloseOptions = MockGitHubOptions & {
  t: TestContext;
  headRef: string;
  branchNamePrefix: string;
};

// pulls と、各コミットの committer のメールアドレスを返す GitHub API のモックを使うクライアント
// 呼び出された API を calls に記録する
function createMockGitHub({
  repository,
  pulls,
  committerEmails,
}: MockGitHubOptions): {
  github: InstanceType<typeof GitHub>;
  calls: ApiCall[];
} {
  const calls: ApiCall[] = [];
  const fetch = async (url: string, init: RequestInit): Promise<Response> => {
    const { pathname, search }: URL = new URL(url);
    const method: string = init.method ?? "GET";
    calls.push([
      method,
      pathname + search,
      typeof init.body === "string" ? JSON.parse(init.body) : undefined,
    ]);

    if (method === "GET") {
      if (pathname === `/repos/${repository}/pulls`) {
        return Response.json(pulls);
      }

      const commitSha: string | undefined = pathname.match(
        /\/git\/commits\/([^/]+)$/,
      )?.[1];

      if (commitSha) {
        return Response.json({
          committer: { email: committerEmails[commitSha] },
        });
      }
    }

    if (
      method === "PATCH" &&
      pathname.startsWith(`/repos/${repository}/pulls/`)
    ) {
      return Response.json({});
    }

    if (
      method === "DELETE" &&
      pathname.startsWith(`/repos/${repository}/git/refs/`)
    ) {
      return new Response(null, { status: 204 });
    }

    return assert.fail(`unexpected request: ${method} ${url}`);
  };
  return { github: getOctokit("dummy-token", { request: { fetch } }), calls };
}

async function runClose({
  repository,
  pulls,
  committerEmails,
  t,
  headRef,
  branchNamePrefix,
}: RunCloseOptions): Promise<{ calls: ApiCall[]; error: unknown }> {
  t.after(() => {
    for (const [key, value] of Object.entries({
      GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
      HEAD_REF: process.env.HEAD_REF,
      BRANCH_NAME_PREFIX: process.env.BRANCH_NAME_PREFIX,
    })) {
      if (value) {
        process.env[key] = value;
      } else {
        delete process.env[key];
      }
    }
  });

  // context.repo は GITHUB_REPOSITORY から owner と repo を取得する
  process.env.GITHUB_REPOSITORY = repository;
  process.env.HEAD_REF = headRef;
  process.env.BRANCH_NAME_PREFIX = branchNamePrefix;
  t.mock.method(console, "log", () => {});
  const { github, calls } = createMockGitHub({
    pulls,
    committerEmails,
    repository,
  });

  try {
    await script(github, context);
    return { calls, error: undefined };
  } catch (error) {
    return { calls, error };
  }
}

test("closes a pull request whose latest commit is made by this action", async (t: TestContext) => {
  const pullNumber: number = 1;
  const sha: string = "a";
  const owner: string = "test-owner";
  const options: RunCloseOptions = {
    pulls: [{ number: pullNumber, head: { sha } }],
    committerEmails: {
      [sha]: "41898282+github-actions[bot]@users.noreply.github.com",
    },
    repository: `${owner}/test-repo`,
    t,
    headRef: "login",
    branchNamePrefix: "fix",
  };
  const { calls, error } = await runClose(options);
  assert.ifError(error);
  assert.deepEqual(calls, [
    [
      "GET",
      `/repos/${options.repository}/pulls?head=${owner}%3A${options.branchNamePrefix}-${options.headRef}&state=open`,
      undefined,
    ],
    ["GET", `/repos/${options.repository}/git/commits/${sha}`, undefined],
    [
      "PATCH",
      `/repos/${options.repository}/pulls/${pullNumber}`,
      { state: "closed" },
    ],
    [
      "DELETE",
      `/repos/${options.repository}/git/refs/heads%2F${options.branchNamePrefix}-${options.headRef}`,
      undefined,
    ],
  ]);
});

// 本Action以外がコミットしている修正PRは close せず、ブランチも削除しない
test("does not close a pull request with commits not made by this action", async (t: TestContext) => {
  const pullNumber: number = 2;
  const sha: string = "b";
  const owner: string = "test-owner";
  const options: RunCloseOptions = {
    repository: `${owner}/test-repo`,
    pulls: [{ number: pullNumber, head: { sha } }],
    committerEmails: { [sha]: "someone@example.com" },
    t,
    headRef: "login",
    branchNamePrefix: "fix",
  };
  const { calls, error } = await runClose(options);
  assert.ok(error instanceof Error);
  assert.equal(
    error.message,
    `Failed to close #${pullNumber} because ${options.branchNamePrefix}-${options.headRef} has commits not made by this action (the committer of the latest commit is ${options.committerEmails[sha]})`,
  );
  assert.deepEqual(calls, [
    [
      "GET",
      `/repos/${options.repository}/pulls?head=${owner}%3A${options.branchNamePrefix}-${options.headRef}&state=open`,
      undefined,
    ],
    ["GET", `/repos/${options.repository}/git/commits/${sha}`, undefined],
  ]);
});
