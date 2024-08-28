#!/bin/sh

echo "Waiting for postgres..."

while ! nc -z db 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --no-input
# For now, uncomment for initial data load 
#python manage.py loaddata initial-data-fixture.json

exec "$@"
