import type { context } from "@actions/github";
import type { GitHub } from "@actions/github/lib/utils";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export async function script(
  github: InstanceType<typeof GitHub>,
  ctx: typeof context,
) {
  const issuesAddAssigneesParams: RestEndpointMethodTypes["issues"]["addAssignees"]["parameters"] =
    {
      owner: ctx.repo.owner,
      repo: ctx.repo.repo,
      issue_number: Number(process.env.PR_NUMBER),
      assignees: [ctx.actor],
    };
  console.log("call issues.addAssignees:");
  console.log(issuesAddAssigneesParams);
  await github.rest.issues.addAssignees(issuesAddAssigneesParams);
}
