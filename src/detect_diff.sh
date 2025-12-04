#!/usr/bin/env bash
set -e

git add -A

if git diff --cached --quiet; then
	result=""
else
	result="差分あり"
fi

echo "result=$result" >>"${GITHUB_OUTPUT}"
