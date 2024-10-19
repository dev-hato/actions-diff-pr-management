import type { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export async function script(
  github: InstanceType<typeof GitHub>,
  context: Context,
) {
  const issuesAddAssigneesParams: RestEndpointMethodTypes["issues"]["addAssignees"]["parameters"] =
    {
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: Number(process.env.PR_NUMBER),
      assignees: [context.actor],
    };
  console.log("call issues.addAssignees:");
  console.log(issuesAddAssigneesParams);
  await github.rest.issues.addAssignees(issuesAddAssigneesParams);
}
