#!/usr/bin/env bash

git config user.name "github-actions[bot]"
EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
git config user.email "${EMAIL}"
git commit -m "${PR_TITLE_PREFIX}"
REPO_URL="https://"
REPO_URL+="${AUTHOR}:${TOKEN}@github.com/"
REPO_URL+="${REPOSITORY}.git"
GITHUB_HEAD="HEAD:refs/heads/${BRANCH_NAME_PREFIX}-${HEAD_REF}"
git push -f "${REPO_URL}" "${GITHUB_HEAD}"
