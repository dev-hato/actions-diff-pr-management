module.exports = async ({ github, context }) => {
  const headRef = process.env.HEAD_REF.replaceAll('#', '')
  const PR_NUMBER = process.env.PR_NUMBER
  const PR_TITLE_PREFIX = process.env.PR_TITLE_PREFIX
  let head = process.env.BRANCH_NAME_PREFIX

  if (headRef !== '') {
    head += '-' + headRef
  }

  head = head.replaceAll('#', '')

  const headWithRepo = process.env.ORG_NAME + ':' + head
  let title = PR_TITLE_PREFIX
  let body = process.env.PR_DESCRIPTION_PREFIX

  body += `本PR ( \`${head}\` ) をマージすると差分が次のPRに反映されます。\n`
  body += '* '

  if (PR_NUMBER !== '') {
    body += `#${PR_NUMBER} ( `
  }

  body += `\`${headRef}\``

  if (PR_NUMBER !== '') {
    body += ' )'
  }

  body += '\n'
  body += '```mermaid\n'
  body += `%%{init: {'gitGraph': {'mainBranchName': '${headRef}'}}}%%\n`
  body += 'gitGraph\n'

  for (let i = 0; i < 2; i++) {
    body += '  commit\n'
  }

  body += `  branch ${head}\n`
  body += `  checkout ${head}\n`
  let commit = PR_TITLE_PREFIX

  if (commit.length > 6) {
    commit = commit.substring(0, 6) + '......'
  }

  body += `  commit id: "${commit}"\n`
  body += `  checkout ${headRef}\n`
  body += `  merge ${head}\n`
  body += '```'

  if (PR_NUMBER !== '') {
    title += ' #' + PR_NUMBER
  }

  const pullsCreateParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    head: headWithRepo,
    base: headRef,
    title,
    body
  }
  console.log('call pulls.create:', pullsCreateParams)
  const createPullRes = await github.rest.pulls.create(
    pullsCreateParams
  )
  return createPullRes.data.number
}
