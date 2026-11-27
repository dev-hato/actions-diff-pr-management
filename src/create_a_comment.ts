import type { context } from "@actions/github";
import type { GitHub } from "@actions/github/lib/utils";
import type { components } from "@octokit/openapi-types";
import type { PaginatingEndpoints } from "@octokit/plugin-paginate-rest";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export async function script(
  github: InstanceType<typeof GitHub>,
  ctx: typeof context,
) {
  const commentBody: string = `#${process.env.CREATED_PR_NUMBER} が作成されたので確認してください。`;

  // 同じコメントを何度も投稿するとしつこいため、同じ本文のコメントがすでにあれば投稿しない。
  // 投稿者は確認しない。他の人が同じ本文を投稿していても、それで修正PRに気付けるため問題ない。
  const issuesListCommentsParams: RestEndpointMethodTypes["issues"]["listComments"]["parameters"] =
    {
      owner: ctx.repo.owner,
      repo: ctx.repo.repo,
      issue_number: Number(process.env.ORIGINAL_PR_NUMBER),
    };
  console.log("call issues.listComments:");
  console.log(issuesListCommentsParams);
  const comments: PaginatingEndpoints["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"]["response"]["data"] =
    await github.paginate(
      github.rest.issues.listComments,
      issuesListCommentsParams,
    );

  if (
    comments.some(
      ({ body }: components["schemas"]["issue-comment"]): boolean =>
        body === commentBody,
    )
  ) {
    return;
  }

  const issuesCreateCommentParams: RestEndpointMethodTypes["issues"]["createComment"]["parameters"] =
    {
      owner: ctx.repo.owner,
      repo: ctx.repo.repo,
      issue_number: Number(process.env.ORIGINAL_PR_NUMBER),
      body: commentBody,
    };
  console.log("call issues.createComment:");
  console.log(issuesCreateCommentParams);
  await github.rest.issues.createComment(issuesCreateCommentParams);
}
