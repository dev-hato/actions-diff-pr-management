module.exports = async ({ github, context }) => {
  const pullsRequestReviewersParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: process.env.PR_NUMBER,
    reviewers: [context.actor]
  }
  console.log('call pulls.requestReviewers:')
  console.log(pullsRequestReviewersParams)
  await github.rest.pulls.requestReviewers(pullsRequestReviewersParams)

  const issuesAddAssigneesParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: process.env.PR_NUMBER,
    assignees: [context.actor]
  }
  console.log('call issues.addAssignees:')
  console.log(issuesAddAssigneesParams)
  await github.rest.issues.addAssignees(issuesAddAssigneesParams)
}
