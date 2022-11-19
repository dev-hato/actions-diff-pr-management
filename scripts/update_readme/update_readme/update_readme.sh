#!/usr/bin/env bash

export DESCRIPTION="$(yq '.description' action.yml)"
envsubst < README.template.md > README.md
