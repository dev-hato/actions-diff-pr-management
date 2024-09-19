module.exports = async ({ github, context, additionalParams }) => {
  const HEAD_REF = process.env.HEAD_REF;
  let head = context.repo.owner + ":" + process.env.BRANCH_NAME_PREFIX;

  if (HEAD_REF !== "") {
    head += "-" + HEAD_REF;
  }

  const pullsListParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    head,
    state: "open",
    ...additionalParams,
  };
  console.log("call pulls.list:", pullsListParams);
  return await github.paginate(github.rest.pulls.list, pullsListParams);
};
