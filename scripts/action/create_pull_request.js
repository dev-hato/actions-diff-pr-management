module.exports = async ({github, context}) => {
    const HEAD_REF = process.env["HEAD_REF"]
    const PR_NUMBER = process.env["PR_NUMBER"]
    const PR_TITLE_PREFIX = process.env["PR_TITLE_PREFIX"]
    let head = process.env["BRANCH_NAME_PREFIX"]

    if (HEAD_REF !== "") {
        head += "-" + HEAD_REF
    }

    const head_with_repo = process.env["ORG_NAME"] + ":" + head
    let title = PR_TITLE_PREFIX
    let body = process.env["PR_DESCRIPTION_PREFIX"]

    if (PR_NUMBER !== "") {
        body += `本PR ( \`${head}\` ) をマージすると差分が次のPRに反映されます。\n`
        body += `* #${PR_NUMBER} ( \`${HEAD_REF}\` )\n`
        body += "```mermaid\n"
        body += `%%{init: {'gitGraph': {'mainBranchName': '${HEAD_REF}'}}}%%\n`
        body += "gitGraph\n"

        for (let i = 0; i < 2; i++) {
            body += "  commit\n"
        }

        body += `  branch ${head}\n`
        body += `  checkout ${head}\n`
        let commit = PR_TITLE_PREFIX

        if (6 < commit.length) {
            commit = commit.substring(0, 6) + '......'
        }

        body += `  commit id: "${commit}"\n`
        body += `  checkout ${HEAD_REF}\n`
        body += `  merge ${head}\n`
        body += "```"
        title += " #" + PR_NUMBER
    }

    const pulls_create_params = {
        owner: context.repo.owner,
        repo: context.repo.repo,
        head: head_with_repo,
        base: HEAD_REF,
        title,
        body
    }
    console.log("call pulls.create:", pulls_create_params)
    const create_pull_res = await github.rest.pulls.create(
        pulls_create_params
    )
    return create_pull_res.data.number
}
