import type { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { generateTitleDescription } from "./generate_title_description";

export async function script(
  github: InstanceType<typeof GitHub>,
  context: Context,
): Promise<number> {
  const HEAD_REF = process.env.HEAD_REF || "";
  const HEAD_NAME = process.env.HEAD_NAME;
  const headWithRepo = context.repo.owner + ":" + HEAD_NAME;
  const { title, body } = generateTitleDescription();
  const pullsCreateParams: RestEndpointMethodTypes["pulls"]["create"]["parameters"] =
    {
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
