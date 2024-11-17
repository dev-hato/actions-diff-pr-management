"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPullRequests = getPullRequests;
async function getPullRequests(github, context, base) {
    const HEAD_NAME = process.env.HEAD_NAME;
    const head = context.repo.owner + ":" + HEAD_NAME;
    const pullsListParams = {
        owner: context.repo.owner,
        repo: context.repo.repo,
        head,
        state: "open",
        base,
    };
    console.log("call pulls.list:", pullsListParams);
    return await github.paginate(github.rest.pulls.list, pullsListParams);
}
