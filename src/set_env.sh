#!/usr/bin/env bash

{
  echo "HEAD_REF=$HEAD_REF"
  echo "PR_DESCRIPTION_PREFIX=$PR_DESCRIPTION_PREFIX"
  echo "PR_NUMBER=$PR_NUMBER"
  echo "PR_TITLE_PREFIX=$PR_TITLE_PREFIX"
  echo "BRANCH_NAME_PREFIX=$BRANCH_NAME_PREFIX"
  echo "HEAD_NAME=$BRANCH_NAME_PREFIX"
  echo "ESCAPED_HEAD_REF=${HEAD_REF//#/}"
  echo "PR_TITLE=$PR_TITLE_PREFIX"
  echo "GIT_COMMIT_COMMAND=git commit"
  echo "GIT_PUSH_COMMAND=git push"
} >> "$GITHUB_ENV"
