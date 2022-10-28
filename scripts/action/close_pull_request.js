module.exports = async ({ github, context }) => {
  const HEAD_REF = process.env.HEAD_REF
  let headName = process.env.BRANCH_NAME_PREFIX

  if (HEAD_REF !== '') {
    headName += '-' + HEAD_REF
  }

  const commonParams = {
    owner: context.repo.owner,
    repo: context.repo.repo
  }
  const pullsListParams = {
    head: process.env.ORG_NAME + ':' + headName,
    base: HEAD_REF,
    state: 'open',
    ...commonParams
  }
  console.log('call pulls.list:', pullsListParams)
  const pulls = await github.paginate(github.rest.pulls.list, pullsListParams)

  for (const pull of pulls) {
    const pullsUpdateParams = {
      pull_number: pull.number,
      state: 'closed',
      ...commonParams
    }
    console.log('call pulls.update:', pullsUpdateParams)
    await github.rest.pulls.update(pullsUpdateParams)
    const gitDeleteRefParams = {
      ref: 'heads/' + headName,
      ...commonParams
    }
    console.log('call git.deleteRef:', gitDeleteRefParams)
    await github.rest.git.deleteRef(gitDeleteRefParams)
  }
}
