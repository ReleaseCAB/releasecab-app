#!/bin/sh

##
## Stop and remove all docker containers from your system
## NOTE: THIS IS NOT BE USED OTHER THAN IN DEV/LOCAL
##
docker stop $(docker ps -a -q)
docker rm -f $(docker ps -a -q)
docker rmi -f $(docker images -q)

docker system prune --volumes
