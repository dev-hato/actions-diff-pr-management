#!/usr/bin/env bash

{
  echo "BODY_PR_NUMBER=${BODY_PR_NUMBER}#${PR_NUMBER} ( "
  echo "PR_TITLE=$PR_TITLE #$PR_NUMBER"
} >> "$GITHUB_ENV"
