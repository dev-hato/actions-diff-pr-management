const getPullRequests = require("./get_pull_requests.js");

module.exports = async ({ github, context }) => {
  const HEAD_REF = process.env.HEAD_REF;
  const pulls = await getPullRequests({
    github,
    context,
    additionalParams: { base: HEAD_REF },
  });
  return pulls.length;
};
