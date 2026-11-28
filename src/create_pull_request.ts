import type * as core from "@actions/core";
import type { context } from "@actions/github";
import type { GitHub } from "@actions/github/lib/utils";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { generateTitleDescription } from "./generate_title_description";

export async function script(
  github: InstanceType<typeof GitHub>,
  ctx: typeof context,
  actionsCore: typeof core,
) {
  const HEAD_REF = process.env.HEAD_REF || "";
  let head = process.env.BRANCH_NAME_PREFIX;

  if (HEAD_REF !== "") {
    head += "-" + HEAD_REF;
  }

  const headWithRepo = ctx.repo.owner + ":" + head;
  const { title, body } = generateTitleDescription();
  const pullsCreateParams: RestEndpointMethodTypes["pulls"]["create"]["parameters"] =
    {
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
