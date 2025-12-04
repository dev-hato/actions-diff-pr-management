#!/usr/bin/env bash
set -e

DESCRIPTION="$(yq '.description' action.yml)"
export DESCRIPTION
envsubst <README.template.md >README.md
