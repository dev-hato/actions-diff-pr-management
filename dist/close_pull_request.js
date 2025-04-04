"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = script;
const get_pull_requests_1 = require("./get_pull_requests");
async function script(github, context) {
    const HEAD_REF = process.env.HEAD_REF;
    let headName = process.env.BRANCH_NAME_PREFIX;
    if (HEAD_REF !== "") {
        headName += "-" + HEAD_REF;
    }
    for (const pull of await (0, get_pull_requests_1.getPullRequests)(github, context)) {
        // 修正PRをcloseする (修正PRのstateをclosedに更新する)
        const pullsUpdateParams = {
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pull.number,
            state: "closed",
        };
        console.log("call pulls.update:", pullsUpdateParams);
        await github.rest.pulls.update(pullsUpdateParams);
        // 修正PRのブランチを削除する
        const gitDeleteRefParams = {
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: "heads/" + headName,
        };
        console.log("call git.deleteRef:", gitDeleteRefParams);
        await github.rest.git.deleteRef(gitDeleteRefParams);
    }
}
