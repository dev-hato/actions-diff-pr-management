#!/usr/bin/env bash

DESCRIPTION="$(yq '.description' action.yml)"
envsubst < README.template.md > README.md
