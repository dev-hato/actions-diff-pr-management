import 'source-map-support/register';
import type { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
import { getPullRequests } from "./get_pull_requests";

export async function script(
  github: InstanceType<typeof GitHub>,
  context: Context,
): Promise<number> {
  const HEAD_REF = process.env.HEAD_REF;
  const pulls = await getPullRequests(github, context, HEAD_REF);
  return pulls.length;
}
