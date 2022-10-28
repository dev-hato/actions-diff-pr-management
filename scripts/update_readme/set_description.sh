#!/usr/bin/env bash

echo "DESCRIPTION=$(yq '.description' action.yml)" >> "${GITHUB_ENV}"
