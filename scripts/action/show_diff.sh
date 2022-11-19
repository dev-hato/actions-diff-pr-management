#!/usr/bin/env bash

git add -A

result=$(git diff --cached)
result="${result//'%'/'%25'}"
result="${result//$'\n'/'%0A'}"
result="${result//$'\r'/'%0D'}"
echo "result=$result" >>"${GITHUB_OUTPUT}"
