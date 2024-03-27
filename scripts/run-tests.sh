#!/bin/bash

##
## Run backend tests
##

docker-compose --env-file releasecab_api/environments/env.dev -f docker-compose-arm.dev.yml up -d 
docker-compose --env-file releasecab_api/environments/env.dev -f docker-compose-arm.dev.yml exec web sh -c \
  "cd releasecab_api && PYTHONWARNINGS=ignore coverage run manage.py test && coverage report && coverage html && coverage-badge -o coverage.svg"
sleep 2
docker-compose --env-file releasecab_api/environments/env.dev -f docker-compose-arm.dev.yml stop
docker-compose --env-file releasecab_api/environments/env.dev -f docker-compose-arm.dev.yml down -v