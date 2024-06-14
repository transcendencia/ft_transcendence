#!/bin/bash 

if [ "$POSTGRES_HOST" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

openssl genpkey -algorithm RSA -out privkey.pem -aes256
openssl req -new -key privkey.pem -out cert.csr
openssl x509 -req -days 365 -in cert.csr -signkey privkey.pem -out fullchain.pem


# python manage.py makemigrations
python manage.py makemigrations
python manage.py makemigrations authentication
python manage.py migrate
python manage.py collectstatic --noinput

#uvicorn backend.asgi:application --host 0.0.0.0 --port 8000  --port 443 --ssl-keyfile privkey.pem --ssl-certfile fullchain.pem


USER_USERNAME=${DJANGO_USER_USERNAME:-"bot"}
USER_PASSWORD=${DJANGO_USER_PASSWORD:-"bot1234"}
USER_STATUS=${DJANGO_USER_STATUS:-"active"}

python manage.py shell <<EOF
from django.core.management import call_command
from authentication.models import User

if not User.objects.filter(username='${USER_USERNAME}').exists():
    User.objects.create_user(username='${USER_USERNAME}', password='${USER_PASSWORD}', status="online", profile_picture="media/botLogo.jpg")
    user.save()
EOF

python manage.py runserver 0.0.0.0:8000
