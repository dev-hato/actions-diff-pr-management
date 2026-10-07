#!/usr/bin/env node
const fs = require("node:fs");
const args = process.argv.slice(2);
fs.appendFileSync(process.env.MOCK_GIT_LOG, JSON.stringify(args) + "\n");
const status =
  args[0] === "commit"
    ? process.env.MOCK_COMMIT_STATUS
    : args[0] === "push"
      ? process.env.MOCK_PUSH_STATUS
      : 0;
process.exit(Number(status || 0));
