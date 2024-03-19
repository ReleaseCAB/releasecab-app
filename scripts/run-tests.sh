#!/bin/bash

##
## Run backend tests
##

docker-compose --env-file releasecab_api/environments/env.dev -f docker-compose-arm.dev.yml up -d 
docker-compose --env-file releasecab_api/environments/env.dev -f docker-compose-arm.dev.yml exec web sh -c \
  "cd releasecab_api && coverage run --omit=*/__init__.py,manage.py,*/api_root.py,*/migrations/*,*/tests/*,*/settings.py,*/urls.py manage.py test && coverage report"
sleep 2
docker-compose --env-file releasecab_api/environments/env.dev -f docker-compose-arm.dev.yml stop
docker-compose --env-file releasecab_api/environments/env.dev -f docker-compose-arm.dev.yml down -v