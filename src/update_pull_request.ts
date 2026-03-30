import type { context } from "@actions/github";
import type { GitHub } from "@actions/github/lib/utils";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { generateTitleDescription } from "./generate_title_description";
import { getPullRequests } from "./get_pull_requests";

export async function script(
  github: InstanceType<typeof GitHub>,
  ctx: typeof context,
) {
  const { title, body } = generateTitleDescription();

  for (const pull of await getPullRequests(github, ctx)) {
    // PRのタイトルやDescriptionを更新する
    if (pull.title !== title || pull.body !== body) {
      const pullsUpdateParams: RestEndpointMethodTypes["pulls"]["update"]["parameters"] =
        {
          owner: ctx.repo.owner,
          repo: ctx.repo.repo,
          pull_number: pull.number,
          title,
          body,
        };
      console.log("call pulls.update:", pullsUpdateParams);
      await github.rest.pulls.update(pullsUpdateParams);
    }

    const labels: string[] | undefined = process.env.PR_LABELS?.split(
      ",",
    ).filter((l) => l !== "");

    if (labels === undefined || labels.length === 0) {
      continue;
    }

    // ラベルを付与する
    const issuesAddLabelsParams: RestEndpointMethodTypes["issues"]["addLabels"]["parameters"] =
      {
        owner: ctx.repo.owner,
        repo: ctx.repo.repo,
        issue_number: pull.number,
        labels,
      };
    console.log("call issues.addLabels:", issuesAddLabelsParams);
    await github.rest.issues.addLabels(issuesAddLabelsParams);
  }
}
