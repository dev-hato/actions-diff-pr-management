#!/usr/bin/env bash

tsc scripts/action/*.ts
mv scripts/action/*.js dist/
