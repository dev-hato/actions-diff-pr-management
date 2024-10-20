#!/usr/bin/env bash

{
	echo "GIT_COMMIT_COMMAND=$GIT_COMMIT_COMMAND --no-verify"
	echo "GIT_PUSH_COMMAND=$GIT_PUSH_COMMAND --no-verify"
} >>"$GITHUB_ENV"
