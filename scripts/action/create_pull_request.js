module.exports = async ({ github, context }) => {
  const HEAD_REF = process.env.HEAD_REF
  const escapedHeadRef = HEAD_REF.replaceAll('#', '')
  const PR_NUMBER = process.env.PR_NUMBER
  const PR_TITLE_PREFIX = process.env.PR_TITLE_PREFIX
  let head = process.env.BRANCH_NAME_PREFIX

  if (HEAD_REF !== '') {
    head += '-' + HEAD_REF
  }

  const escapedHead = head.replaceAll('#', '')

  const headWithRepo = process.env.ORG_NAME + ':' + head
  let title = PR_TITLE_PREFIX
  let body = process.env.PR_DESCRIPTION_PREFIX

  body += `本PR ( \`${escapedHead}\` ) をマージすると差分が次のPRに反映されます。\n`
  body += '* '

  if (PR_NUMBER !== '') {
    body += `#${PR_NUMBER} ( `
  }

  body += `\`${escapedHeadRef}\``

  if (PR_NUMBER !== '') {
    body += ' )'
  }

  body += '\n'
  body += '```mermaid\n'
  body += `%%{init: {'gitGraph': {'mainBranchName': '${escapedHeadRef}'}}}%%\n`
  body += 'gitGraph\n'

  for (let i = 0; i < 2; i++) {
    body += '  commit\n'
  }

  body += `  branch ${escapedHead}\n`
  body += `  checkout ${escapedHead}\n`
  let commit = PR_TITLE_PREFIX

  if (commit.length > 6) {
    commit = commit.substring(0, 6) + '......'
  }

  body += `  commit id: "${commit}"\n`
  body += `  checkout ${escapedHeadRef}\n`
  body += `  merge ${escapedHead}\n`
  body += '```'

  if (PR_NUMBER !== '') {
    title += ' #' + PR_NUMBER
  }

  const pullsCreateParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    head: headWithRepo,
    base: HEAD_REF,
    title,
    body
  }
  console.log('call pulls.create:', pullsCreateParams)
  const createPullRes = await github.rest.pulls.create(
    pullsCreateParams
  )
  return createPullRes.data.number
}
