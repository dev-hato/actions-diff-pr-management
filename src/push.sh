#!/usr/bin/env bash

git config user.name "github-actions[bot]"
EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
git config user.email "${EMAIL}"
GIT_COMMIT_COMMAND="$GIT_COMMIT_COMMAND -m \"${PR_TITLE_PREFIX}\""
eval "$GIT_COMMIT_COMMAND"
REPO_URL="https://"
REPO_URL+="${GITHUB_ACTOR}:${TOKEN}@github.com/"
REPO_URL+="${GITHUB_REPOSITORY}.git"
GITHUB_HEAD="HEAD:refs/heads/${BRANCH_NAME_PREFIX}-${HEAD_REF}"
GIT_PUSH_COMMAND="$GIT_PUSH_COMMAND -f \"${REPO_URL}\" \"${GITHUB_HEAD}\""
eval "$GIT_PUSH_COMMAND"
