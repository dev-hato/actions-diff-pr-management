module.exports = async ({github, context}) => {
    const HEAD_REF = process.env["HEAD_REF"]
    let head = process.env["ORG_NAME"] + ":" + process.env["BRANCH_NAME_PREFIX"]

    if (HEAD_REF !== "") {
        head += "-" + HEAD_REF
    }

    const pulls_list_params = {
        owner: context.repo.owner,
        repo: context.repo.repo,
        head,
        base: HEAD_REF,
        state: "open"
    }
    console.log("call pulls.list:", pulls_list_params)
    const pulls = await github.paginate(github.rest.pulls.list, pulls_list_params)
    return pulls.length
}
