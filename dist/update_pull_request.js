"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = script;
const generate_title_description_1 = require("./generate_title_description");
const get_pull_requests_1 = require("./get_pull_requests");
async function script(github, context) {
    var _a;
    const { title, body } = (0, generate_title_description_1.generateTitleDescription)();
    for (const pull of await (0, get_pull_requests_1.getPullRequests)(github, context)) {
        // PRのタイトルやDescriptionを更新する
        if (pull.title !== title || pull.body !== body) {
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
        const labels = (_a = process.env.PR_LABELS) === null || _a === void 0 ? void 0 : _a.split(",").filter((l) => l !== "");
        if (labels === undefined || labels.length === 0) {
            continue;
        }
        // ラベルを付与する
        const issuesAddLabelsParams = {
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: pull.number,
            labels,
        };
        console.log("call issues.addLabels:", issuesAddLabelsParams);
        await github.rest.issues.addLabels(issuesAddLabelsParams);
    }
}
