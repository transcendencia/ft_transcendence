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



python manage.py shell <<EOF
from django.core.management import call_command
from authentication.models import User
from django.utils.crypto import get_random_string
import os

USER_USERNAME=${BOT_USERNAME:-"bot"}
USER_STATUS=${BOT_STATUS:-"online"}

characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*(-_=+)'
bot_password = get_random_string(8, characters)
if not User.objects.filter(username=USER_USERNAME).exists():
    user = User.objects.create_user(username=BOT_USERNAME, status=USER_STATUS)
    user.set_password(bot_password)
    user.profile_picture = "botLogo.png"
    user.save()
EOF


# mkdir /cert
# openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /cert/key.pem -out /cert/cert.pem -subj "/CN=localhost"
# uvicorn backend.asgi:application --host 0.0.0.0 --port 8000 --ssl-keyfile /cert/key.pem --ssl-certfile /cert/cert.pem

# Ajouter les tâches cron
# Démarrer le service cron

# uvicorn backend.asgi:application --host 0.0.0.0 --port 8000 --ssl-keyfile /backend/cert/key.pem --ssl-certfile /backend/cert/cert.pem

# Afficher les tâches cron pour confirmation
# python manage.py runserver 0.0.0.0:8000

exec python manage.py runserver 0.0.0.0:8000