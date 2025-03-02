import type { AsyncFunctionArguments } from "@actions/github-script";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { generateTitleDescription } from "@/generate_title_description";
import { getPullRequests } from "@/get_pull_requests";

export async function script({ github, context }: AsyncFunctionArguments) {
  const { title, body } = generateTitleDescription();

  for (const pull of await getPullRequests(<AsyncFunctionArguments>{
    github,
    context,
  })) {
    if (pull.title === title && pull.body === body) {
      continue;
    }

    // PRのタイトルやDescriptionを更新する
    const pullsUpdateParams: RestEndpointMethodTypes["pulls"]["update"]["parameters"] =
      {
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pull.number,
        title,
        body,
      };
    console.log("call pulls.update:", pullsUpdateParams);
    await github.rest.pulls.update(pullsUpdateParams);
  }
}
