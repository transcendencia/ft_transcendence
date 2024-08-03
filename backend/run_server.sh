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
from authentication.models import User
from django.utils.crypto import get_random_string

characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*(-_=+)'
bot_password = get_random_string(8, characters)

if not User.objects.filter(username="bot").exists():
    user = User.objects.create_user(username="bot", status="online", profile_picture="botLogo.png")
    user.set_password(bot_password)
    user.save()
EOF



uvicorn backend.asgi:application --host 0.0.0.0 --port 8000 --ssl-keyfile /backend/cert/key.pem --ssl-certfile /backend/cert/cert.pem

# exec python manage.py runserver 0.0.0.0:8000 

