const generateTitleDescription = require("./generate_title_description.js");
const getPullRequests = require('./get_pull_requests.js');

module.exports = async ({ github, context }) => {
  const { title, body } = generateTitleDescription();

  for (const pull of await getPullRequests({github, context})) {
    if (pull.title === title && pull.body === body) {
      continue;
    }

    // PRのタイトルやDescriptionを更新する
    const pullsUpdateParams = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pull.number,
      title,
      body,
    };
    console.log("call pulls.update:", pullsUpdateParams);
    await github.rest.pulls.update(pullsUpdateParams);
  }
};
