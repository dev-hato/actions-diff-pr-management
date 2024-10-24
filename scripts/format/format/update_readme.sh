#!/usr/bin/env bash

DESCRIPTION="$(yq '.description' action.yml)"
export DESCRIPTION
envsubst <README.template.md >README.md
