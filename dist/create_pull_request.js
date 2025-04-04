"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = script;
const generate_title_description_1 = require("./generate_title_description");
async function script(github, context) {
    const HEAD_REF = process.env.HEAD_REF || "";
    let head = process.env.BRANCH_NAME_PREFIX;
    if (HEAD_REF !== "") {
        head += "-" + HEAD_REF;
    }
    const headWithRepo = context.repo.owner + ":" + head;
    const { title, body } = (0, generate_title_description_1.generateTitleDescription)();
    const pullsCreateParams = {
        owner: context.repo.owner,
        repo: context.repo.repo,
        head: headWithRepo,
        base: HEAD_REF,
        title,
        body,
    };
    console.log("call pulls.create:", pullsCreateParams);
    const createPullRes = await github.rest.pulls.create(pullsCreateParams);
    return createPullRes.data.number;
}
