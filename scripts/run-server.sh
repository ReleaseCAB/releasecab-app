#!/bin/bash

##
## Start the Release Cab Server
## Takes in 1 parameter [dev | prod], and starts the docker containers
##

if [ "$#" -ne 1 ]
then
    printf "%s\n" "dev/prod argument required"
    exit 1
fi

if [ "$1" == "dev" ]
then
    PLATFORM=$(uname -m)
    if [ "$PLATFORM" == "arm64" ]
    then
        docker-compose --env-file releasecab_api/environments/env.dev -f docker-compose-arm.dev.yml up
    else
        printf "%s\n" "No docker-compose file for this platform yet!"
    fi
fi

if [ "$1" == "prod" ]
then
    printf "%s\n" "TODO: Implement production container"
fi
