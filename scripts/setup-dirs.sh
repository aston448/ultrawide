#!/usr/bin/env bash

if [ -f /home/circleci/data ]
then
    echo Data Dir Exists

else
    echo Creating Ultrawide Data Dir

    mkdir /home/circleci/data

fi