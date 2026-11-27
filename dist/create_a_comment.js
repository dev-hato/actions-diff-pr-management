"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.script = script;
async function script(github, ctx) {
    const commentBody = `#${process.env.CREATED_PR_NUMBER} が作成されたので確認してください。`;
    // 同じコメントを何度も投稿するとしつこいため、同じ本文のコメントがすでにあれば投稿しない。
    // 投稿者は確認しない。他の人が同じ本文を投稿していても、それで修正PRに気付けるため問題ない。
    const issuesListCommentsParams = {
        owner: ctx.repo.owner,
        repo: ctx.repo.repo,
        issue_number: Number(process.env.ORIGINAL_PR_NUMBER),
    };
    console.log("call issues.listComments:");
    console.log(issuesListCommentsParams);
    const comments = await github.paginate(github.rest.issues.listComments, issuesListCommentsParams);
    if (comments.some(({ body }) => body === commentBody)) {
        return;
    }
    const issuesCreateCommentParams = {
        owner: ctx.repo.owner,
        repo: ctx.repo.repo,
        issue_number: Number(process.env.ORIGINAL_PR_NUMBER),
        body: commentBody,
    };
    console.log("call issues.createComment:");
    console.log(issuesCreateCommentParams);
    await github.rest.issues.createComment(issuesCreateCommentParams);
}
