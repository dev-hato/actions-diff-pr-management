import type { AsyncFunctionArguments } from "@actions/github-script";
import { getPullRequests } from "./get_pull_requests";

export async function script({
  github,
  context,
}: AsyncFunctionArguments): Promise<number> {
  const HEAD_REF = process.env.HEAD_REF;
  const pulls = await getPullRequests(<AsyncFunctionArguments>{github, context}, HEAD_REF);
  return pulls.length;
}
