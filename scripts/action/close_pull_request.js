const getPullRequests = require("./get_pull_requests.js");

module.exports = async ({ github, context }) => {
  const HEAD_REF = process.env.HEAD_REF;
  let headName = process.env.BRANCH_NAME_PREFIX;

  if (HEAD_REF !== "") {
    headName += "-" + HEAD_REF;
  }

  const commonParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
  };

  for (const pull of await getPullRequests({ github, context })) {
    // 修正PRをcloseする (修正PRのstateをclosedに更新する)
    const pullsUpdateParams = {
      pull_number: pull.number,
      state: "closed",
      ...commonParams,
    };
    console.log("call pulls.update:", pullsUpdateParams);
    await github.rest.pulls.update(pullsUpdateParams);

    // 修正PRのブランチを削除する
    const gitDeleteRefParams = {
      ref: "heads/" + headName,
      ...commonParams,
    };
    console.log("call git.deleteRef:", gitDeleteRefParams);
    await github.rest.git.deleteRef(gitDeleteRefParams);
  }
};
