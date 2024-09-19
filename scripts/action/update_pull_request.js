const generateTitleDescription = require("./generate_title_description.js");

module.exports = async ({ github, context }) => {
  const HEAD_REF = process.env.HEAD_REF;
  let headName = process.env.BRANCH_NAME_PREFIX;

  if (HEAD_REF !== "") {
    headName += "-" + HEAD_REF;
  }

  const { title, body } = generateTitleDescription();
  const commonParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
  };

  // 修正PRの情報を取得する
  const pullsListParams = {
    head: context.repo.owner + ":" + headName,
    state: "open",
    ...commonParams,
  };
  console.log("call pulls.list:", pullsListParams);
  const pulls = await github.paginate(github.rest.pulls.list, pullsListParams);

  for (const pull of pulls) {
    if (pull.title === title && pull.body === body) {
      continue;
    }

    // PRのタイトルやDescriptionを更新する
    const pullsUpdateParams = {
      pull_number: pull.number,
      title,
      body,
      ...commonParams,
    };
    console.log("call pulls.update:", pullsUpdateParams);
    await github.rest.pulls.update(pullsUpdateParams);
  }
};
