"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = void 0;
const generate_title_description_1 = require("./generate_title_description");
const get_pull_requests_1 = require("./get_pull_requests");
async function script(github, context) {
    const { title, body } = (0, generate_title_description_1.generateTitleDescription)();
    for (const pull of await (0, get_pull_requests_1.getPullRequests)(github, context)) {
        if (pull.title === title && pull.body === body) {
            continue;
        }
        // PRのタイトルやDescriptionを更新する
        const pullsUpdateParams = {
            owner: context.repo.owner,
            repo: context.repo.repo,
            pull_number: pull.number,
            title,
            body,
        };
        console.log("call pulls.update:", pullsUpdateParams);
        await github.rest.pulls.update(pullsUpdateParams);
    }
}
exports.script = script;
