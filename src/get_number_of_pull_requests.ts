import type { context } from "@actions/github";
import type { GitHub } from "@actions/github/lib/utils";
import { getPullRequests } from "./get_pull_requests";

export async function script(
  github: InstanceType<typeof GitHub>,
  ctx: typeof context,
): Promise<number> {
  const HEAD_REF = process.env.HEAD_REF;
  const pulls = await getPullRequests(github, ctx, HEAD_REF);
  return pulls.length;
}
