import fs from "node:fs";

const args: string[] = process.argv.slice(2);
const mockGitLog: string | undefined = process.env.MOCK_GIT_LOG;

if (mockGitLog === undefined) {
  throw new Error("MOCK_GIT_LOG environment variable required");
}

fs.appendFileSync(mockGitLog, JSON.stringify(args) + "\n");

// 既定ではリモートにブランチが存在しない (git ls-remote --exit-code の終了コード2)
if (args[0] === "ls-remote") {
  process.exit(Number(process.env.MOCK_LS_REMOTE_STATUS ?? "2"));
}

if (args[0] === "log") {
  process.stdout.write((process.env.MOCK_REMOTE_COMMITTER_EMAIL ?? "") + "\n");
}

const mockCommitStatus: string | undefined = process.env.MOCK_COMMIT_STATUS;

if (args[0] === "commit" && mockCommitStatus) {
  process.exit(Number(mockCommitStatus));
}

const mockPushStatus: string | undefined = process.env.MOCK_PUSH_STATUS;

if (args[0] === "push" && mockPushStatus) {
  process.exit(Number(mockPushStatus));
}
