#!/usr/bin/env bash

delimiter="$(openssl rand -hex 8)"
{
	echo "HEAD_REF=$HEAD_REF"

  echo "PR_DESCRIPTION_PREFIX<<${delimiter}"
  echo "${PR_DESCRIPTION_PREFIX}"
  echo "${delimiter}"

	echo "PR_NUMBER=$PR_NUMBER"
	echo "PR_TITLE_PREFIX=$PR_TITLE_PREFIX"
	echo "BRANCH_NAME_PREFIX=$BRANCH_NAME_PREFIX"
	echo "HEAD_NAME=$BRANCH_NAME_PREFIX"
	echo "GIT_COMMIT_COMMAND=git commit"
	echo "GIT_PUSH_COMMAND=git push"
} >>"$GITHUB_ENV"
