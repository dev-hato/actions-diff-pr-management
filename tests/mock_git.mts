import fs from "node:fs";

const args: string[] = process.argv.slice(2);
const mockGitLog: string | undefined = process.env.MOCK_GIT_LOG;

if (mockGitLog === undefined) {
  throw new Error("MOCK_GIT_LOG environment variable required");
}

fs.appendFileSync(mockGitLog, JSON.stringify(args) + "\n");
const mockCommitStatus: string | undefined = process.env.MOCK_COMMIT_STATUS;

if (args[0] === "commit" && mockCommitStatus) {
  process.exit(Number(mockCommitStatus));
}

const mockPushStatus: string | undefined = process.env.MOCK_PUSH_STATUS;

if (args[0] === "push" && mockPushStatus) {
  process.exit(Number(mockPushStatus));
}
