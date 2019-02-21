#!/usr/bin/env bash

# Guarantee a directory that contains no tests
mkdir ./tmp

echo Starting Chimpy without any tests to download dependencies
chimpy --path=./tmp

# Clean up
rm -rf ./tmp