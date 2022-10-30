module.exports = () => {
  return process.env.GITHUB_REPOSITORY.split('/')[0]
}
