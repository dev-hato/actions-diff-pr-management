module.exports = async ({github, context}) => {
    const issues_add_assignees_params = {
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: process.env["PR_NUMBER"],
        assignees: [process.env["ASSIGN_USER"]]
    }
    console.log("call issues.addAssignees:")
    console.log(issues_add_assignees_params)
    await github.rest.issues.addAssignees(issues_add_assignees_params)
}
