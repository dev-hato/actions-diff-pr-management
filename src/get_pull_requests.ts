import type { GitHub } from "@actions/github/lib/utils";
import type { Context } from "@actions/github/lib/context";
import type { PaginatingEndpoints } from "@octokit/plugin-paginate-rest";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export async function getPullRequests(
  github: InstanceType<typeof GitHub>,
  context: Context,
  base?: string,
): Promise<
  PaginatingEndpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"]
> {
  const HEAD_NAME_WITH_REPO = process.env.HEAD_NAME_WITH_REPO;
  const pullsListParams: RestEndpointMethodTypes["pulls"]["list"]["parameters"] =
    {
      owner: context.repo.owner,
      repo: context.repo.repo,
      head: HEAD_NAME_WITH_REPO,
      state: "open",
      base,
    };
  console.log("call pulls.list:", pullsListParams);
  return await github.paginate(github.rest.pulls.list, pullsListParams);
}
