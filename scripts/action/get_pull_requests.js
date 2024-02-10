module.exports = async ({ github, context }) => {
  const HEAD_REF = process.env.HEAD_REF
  let head = context.repo.owner + ':' + process.env.BRANCH_NAME_PREFIX

  if (HEAD_REF !== '') {
    head += '-' + HEAD_REF
  }

  const pullsListParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    head,
    base: HEAD_REF,
    state: 'open'
  }
  console.log('call pulls.list:', pullsListParams)
  const pulls = await github.paginate(github.rest.pulls.list, pullsListParams)
  return pulls.length
}
