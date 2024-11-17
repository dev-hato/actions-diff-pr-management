"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = script;
require("source-map-support/register");
async function script(github, context) {
    const issuesAddAssigneesParams = {
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: Number(process.env.PR_NUMBER),
        assignees: [context.actor],
    };
    console.log("call issues.addAssignees:");
    console.log(issuesAddAssigneesParams);
    await github.rest.issues.addAssignees(issuesAddAssigneesParams);
}
//# sourceMappingURL=assign_a_user.js.map