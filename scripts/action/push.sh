#!/usr/bin/env bash

git config user.name "github-actions[bot]"
EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
git config user.email "${EMAIL}"
GIT_COMMIT_COMMAND="git commit "

if [ "$NO_VERIFY" = "true" ]; then
  GIT_COMMIT_COMMAND+="--no-verify "
fi

GIT_COMMIT_COMMAND+="-m \"${PR_TITLE_PREFIX}\""
eval "$GIT_COMMIT_COMMAND"
git commit -m "${PR_TITLE_PREFIX}"
REPO_URL="https://"
REPO_URL+="${AUTHOR}:${TOKEN}@github.com/"
REPO_URL+="${REPOSITORY}.git"
GITHUB_HEAD="HEAD:refs/heads/${BRANCH_NAME_PREFIX}-${HEAD_REF}"
GIT_PUSH_COMMAND="git push "

if [ "$NO_VERIFY" = "true" ]; then
  GIT_PUSH_COMMAND+="--no-verify "
fi

GIT_PUSH_COMMAND=+"-f \"${REPO_URL}\" \"${GITHUB_HEAD}\""
eval "$GIT_PUSH_COMMAND"