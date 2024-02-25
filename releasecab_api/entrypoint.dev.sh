#!/bin/sh

echo "Waiting for postgres..."

while ! nc -z db 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

python releasecab_api/manage.py makemigrations
python releasecab_api/manage.py migrate
python releasecab_api/manage.py collectstatic --no-input
# For now, uncomment for initial data load 
#python releasecab_api/manage.py loaddata releasecab_api/initial-data-fixture.json

exec "$@"
