export function generateTitleDescription(): {
  title: string;
  body: string;
} {
  const ESCAPED_HEAD_REF = process.env.ESCAPED_HEAD_REF || "";
  const PR_TITLE_PREFIX = process.env.PR_TITLE_PREFIX || "";
  const HEAD_NAME = process.env.HEAD_NAME || "";
  const BODY_PR_NUMBER = process.env.BODY_PR_NUMBER || "";
  const escapedHead = HEAD_NAME.replace(/#/g, "");
  let PR_TITLE = process.env.PR_TITLE || "";
  let body = process.env.PR_DESCRIPTION_PREFIX || "";

  body += `本PR ( \`${escapedHead}\` ) をマージすると差分が次のPRに反映されます。\n`;
  body += `${BODY_PR_NUMBER}\n\n`;
  body += `CIが再度実行されると本PR ( \`${escapedHead}\` ) にforce pushされます。\n`;
  body += "```mermaid\n";
  body += `%%{init: {'gitGraph': {'mainBranchName': '${ESCAPED_HEAD_REF}'}}}%%\n`;
  body += "gitGraph\n";

  for (let i = 0; i < 2; i++) {
    body += "  commit\n";
  }

  body += `  branch ${escapedHead}\n`;
  body += `  checkout ${escapedHead}\n`;
  let commit = PR_TITLE_PREFIX;

  if (commit.length > 6) {
    commit = commit.substring(0, 6) + "......";
  }

  body += `  commit id: "${commit}"\n`;
  body += `  checkout ${ESCAPED_HEAD_REF}\n`;
  body += `  merge ${escapedHead}\n`;
  body += "```";

  return {
    title: PR_TITLE,
    body,
  };
}
