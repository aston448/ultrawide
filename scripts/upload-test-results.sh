#!/usr/bin/env bash

FILE_NAME=$1

curl -i -H "name: $FILE_NAME" -H "location: Ultrawide Dev Test Outputs" -H "key: lySGChJwdI6OKO3e" -H "Content-Type:text/plain" -X POST --data-binary @.test_results/$FILE_NAME http://178.62.78.222/api/v1/upload-file
