#!/usr/bin/env bash

npm ci
action="$(yq '.jobs.build.steps[-1].uses' .github/workflows/super-linter.yml)"
PATH="$(docker run --rm --entrypoint '' "ghcr.io/${action//\/slim@/:slim-}" /bin/sh -c 'echo $PATH')"
echo "PATH=/github/workspace/node_modules/.bin:${PATH}" >> "$GITHUB_ENV"
