module.exports = () => {
    let HEAD_REF = process.env["HEAD_REF"]
    const BASE_BRANCH = process.env["BASE_BRANCH"]

    if (HEAD_REF === "" && BASE_BRANCH !== "") {
        return BASE_BRANCH
    }

    return HEAD_REF
}
