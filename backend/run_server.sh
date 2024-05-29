#!/bin/bash 

if [ "$POSTGRES_HOST" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# python manage.py makemigrations
python manage.py makemigrations
python manage.py makemigrations authentication
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000
# uvicorn backend.asgi:application --host 0.0.0.0 --port 8000