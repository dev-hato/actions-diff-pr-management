import type { AsyncFunctionArguments } from "@actions/github-script";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { generateTitleDescription } from "./generate_title_description";

export async function script({
  github,
  context,
}: AsyncFunctionArguments): Promise<number> {
  const HEAD_REF = process.env.HEAD_REF || "";
  let head = process.env.BRANCH_NAME_PREFIX;

  if (HEAD_REF !== "") {
    head += "-" + HEAD_REF;
  }

  const headWithRepo = context.repo.owner + ":" + head;
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
