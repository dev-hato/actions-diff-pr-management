#!/usr/bin/env bash
set -e

git add -A

if git diff --cached --quiet; then
	result=""
else
	result="差分あり"

	# forkからのPRでは修正PRを作れないため、何を修正すればよいか分かるよう、差分を出力する
	# それ以外では修正PRで差分を確認できるため、時間がかかりログも増える差分の出力はしない
	if [ "${IS_FORK_PR}" = "true" ]; then
		# 差分に含まれる文字列がワークフローコマンドとして解釈されないよう、ランダムなトークンで停止する
		stop_token="$(openssl rand -hex 16)"
		echo "::stop-commands::${stop_token}"
		git --no-pager diff --cached --no-color
		echo "::${stop_token}::"
	fi
fi

echo "result=$result" >>"${GITHUB_OUTPUT}"
