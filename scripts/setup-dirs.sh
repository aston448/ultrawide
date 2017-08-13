#!/usr/bin/env bash

if [ -f ~/.ultrawide_data ]
then
    echo Data Dir Exists

else
    echo Creating Ultrawide Data Dir

    mkdir ~/.ultrawide_data

fi