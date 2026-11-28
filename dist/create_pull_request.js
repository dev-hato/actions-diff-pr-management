"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = script;
const generate_title_description_1 = require("./generate_title_description");
async function script(github, ctx, actionsCore) {
    const HEAD_REF = process.env.HEAD_REF || "";
    let head = process.env.BRANCH_NAME_PREFIX;
    if (HEAD_REF !== "") {
        head += "-" + HEAD_REF;
    }
    const headWithRepo = ctx.repo.owner + ":" + head;
    const { title, body } = (0, generate_title_description_1.generateTitleDescription)();
    const pullsCreateParams = {
        owner: ctx.repo.owner,
        repo: ctx.repo.repo,
        head: headWithRepo,
        base: HEAD_REF,
        title,
        body,
    };
    console.log("call pulls.create:", pullsCreateParams);
    const createPullRes = await github.rest.pulls.create(pullsCreateParams);
    // 後続のstepで作成した修正PRの番号を使えるよう、環境変数に設定する
    actionsCore.exportVariable("CREATED_PR_NUMBER", createPullRes.data.number);
}
