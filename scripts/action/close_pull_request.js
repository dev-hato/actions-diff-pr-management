module.exports = async ({github, context}) => {
    const HEAD_REF = process.env["HEAD_REF"]
    let head_name = process.env["BRANCH_NAME_PREFIX"]

    if (HEAD_REF !== "") {
        head_name += "-" + HEAD_REF
    }

    const common_params = {
        owner: context.repo.owner,
        repo: context.repo.repo
    }
    const pulls_list_params = {
        head: process.env["ORG_NAME"] + ":" + head_name,
        base: HEAD_REF,
        state: "open",
        ...common_params
    }
    console.log("call pulls.list:", pulls_list_params)
    const pulls = await github.paginate(github.rest.pulls.list,
        pulls_list_params)

    for (const pull of pulls) {
        const pulls_update_params = {
            pull_number: pull.number,
            state: "closed",
            ...common_params
        }
        console.log("call pulls.update:", pulls_update_params)
        await github.rest.pulls.update(pulls_update_params)
        const git_deleteRef_params = {
            ref: "heads/" + head_name,
            ...common_params
        }
        console.log("call git.deleteRef:", git_deleteRef_params)
        await github.rest.git.deleteRef(git_deleteRef_params)
    }
}
