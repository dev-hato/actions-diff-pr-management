"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = script;
async function script(github, ctx) {
    const issuesAddAssigneesParams = {
        owner: ctx.repo.owner,
        repo: ctx.repo.repo,
        issue_number: Number(process.env.PR_NUMBER),
        assignees: [ctx.actor],
    };
    console.log("call issues.addAssignees:");
    console.log(issuesAddAssigneesParams);
    await github.rest.issues.addAssignees(issuesAddAssigneesParams);
}
