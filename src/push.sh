#!/usr/bin/env bash
set -e

git config user.name "github-actions[bot]"
EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
git config user.email "${EMAIL}"
GIT_OPTIONS=()

if [ "$NO_VERIFY" = "true" ]; then
	GIT_OPTIONS+=(--no-verify)
fi

git commit "${GIT_OPTIONS[@]}" -m "${PR_TITLE_PREFIX}"
REPO_URL="https://"
REPO_URL+="${GITHUB_ACTOR}:${TOKEN}@github.com/"
REPO_URL+="${GITHUB_REPOSITORY}.git"
GITHUB_HEAD="HEAD:refs/heads/${BRANCH_NAME_PREFIX}-${HEAD_REF}"
git push "${GIT_OPTIONS[@]}" -f "${REPO_URL}" "${GITHUB_HEAD}"
