#!/bin/bash 

if [ "$POSTGRES_HOST" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py makemigrations
python manage.py makemigrations authentication
python manage.py migrate
python manage.py collectstatic --noinput

USER_USERNAME=${DJANGO_USER_USERNAME:-"bot"}
USER_PASSWORD=${DJANGO_USER_PASSWORD:-"bot1234"}
USER_STATUS=${DJANGO_USER_STATUS:-"active"}

python manage.py shell <<EOF
from django.core.management import call_command
from authentication.models import User
import os

# Définition des variables utilisateur
USER_USERNAME = '${DJANGO_USER_USERNAME:-"bot"}'
USER_PASSWORD = '${DJANGO_USER_PASSWORD:-"bot1234"}'
USER_STATUS = '${DJANGO_USER_STATUS:-"online"}'

if not User.objects.filter(username=USER_USERNAME).exists():
    user = User.objects.create_user(username=USER_USERNAME, password=USER_PASSWORD, status=USER_STATUS)
    user.profile_picture = "botLogo.png"
    user.save()
EOF

daphne -e ssl:8000:privateKey=/backend/cert/key.pem:certKey=/backend/cert/cert.pem -v 3 backend.asgi:application
#exec python manage.py runserver 0.0.0.0:8000