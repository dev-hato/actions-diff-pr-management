#!/usr/bin/env bash
set -e

git config user.name "github-actions[bot]"
EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
git config user.email "${EMAIL}"
GIT_OPTIONS=()

if [ "$NO_VERIFY" = "true" ]; then
	GIT_OPTIONS+=(--no-verify)
fi

REPO_URL="https://"
REPO_URL+="${GITHUB_ACTOR}:${TOKEN}@github.com/"
REPO_URL+="${GITHUB_REPOSITORY}.git"
BRANCH="refs/heads/${BRANCH_NAME_PREFIX}-${HEAD_REF}"

# 本Action以外によるコミットを消さないよう、ブランチが既に存在する場合は、最新のコミットが本Actionによるものであることを確認する
LS_REMOTE_STATUS=0
git ls-remote --exit-code --heads "${REPO_URL}" "${BRANCH}" >/dev/null || LS_REMOTE_STATUS=$?

if [ "$LS_REMOTE_STATUS" -eq 0 ]; then
	git fetch --no-tags "${REPO_URL}" "${BRANCH}"
	COMMITTER="$(git log -1 --format=%ce FETCH_HEAD)"

	if [ "$COMMITTER" != "$EMAIL" ]; then
		MESSAGE="Cannot push to ${BRANCH} because it already has commits not made by this action"
		MESSAGE+=" (the committer of the latest commit is ${COMMITTER}, not ${EMAIL})."
		MESSAGE+=" To avoid overwriting it, delete the branch."
		echo "::error::${MESSAGE}"
		exit 1
	fi
elif [ "$LS_REMOTE_STATUS" -ne 2 ]; then
	# 2はブランチが存在しないことを表す
	exit "$LS_REMOTE_STATUS"
fi

git commit "${GIT_OPTIONS[@]}" -m "${PR_TITLE_PREFIX}"
GITHUB_HEAD="HEAD:${BRANCH}"
git push "${GIT_OPTIONS[@]}" -f "${REPO_URL}" "${GITHUB_HEAD}"
