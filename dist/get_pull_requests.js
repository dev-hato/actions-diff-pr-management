"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPullRequests = getPullRequests;
async function getPullRequests(github, context, base) {
    const HEAD_NAME_WITH_REPO = process.env.HEAD_NAME_WITH_REPO;
    const pullsListParams = {
        owner: context.repo.owner,
        repo: context.repo.repo,
        head: HEAD_NAME_WITH_REPO,
        state: "open",
        base,
    };
    console.log("call pulls.list:", pullsListParams);
    return await github.paginate(github.rest.pulls.list, pullsListParams);
}
