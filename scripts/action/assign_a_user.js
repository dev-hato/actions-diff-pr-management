module.exports = async ({ github, context }) => {
  const issuesAddAssigneesParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: process.env.PR_NUMBER,
    assignees: [context.actor],
  };
  console.log("call issues.addAssignees:");
  console.log(issuesAddAssigneesParams);
  await github.rest.issues.addAssignees(issuesAddAssigneesParams);
};
