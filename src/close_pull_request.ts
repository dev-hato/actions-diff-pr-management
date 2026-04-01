import type { context } from "@actions/github";
import type { GitHub } from "@actions/github/lib/utils";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { getPullRequests } from "./get_pull_requests";

export async function script(
  github: InstanceType<typeof GitHub>,
  ctx: typeof context,
) {
  const HEAD_REF = process.env.HEAD_REF;
  let headName = process.env.BRANCH_NAME_PREFIX;

  if (HEAD_REF !== "") {
    headName += "-" + HEAD_REF;
  }

  for (const pull of await getPullRequests(github, ctx)) {
    // 修正PRをcloseする (修正PRのstateをclosedに更新する)
    const pullsUpdateParams: RestEndpointMethodTypes["pulls"]["update"]["parameters"] =
      {
        owner: ctx.repo.owner,
        repo: ctx.repo.repo,
        pull_number: pull.number,
        state: "closed",
      };
    console.log("call pulls.update:", pullsUpdateParams);
    await github.rest.pulls.update(pullsUpdateParams);

    // 修正PRのブランチを削除する
    const gitDeleteRefParams: RestEndpointMethodTypes["git"]["deleteRef"]["parameters"] =
      {
        owner: ctx.repo.owner,
        repo: ctx.repo.repo,
        ref: "heads/" + headName,
      };
    console.log("call git.deleteRef:", gitDeleteRefParams);
    await github.rest.git.deleteRef(gitDeleteRefParams);
  }
}
