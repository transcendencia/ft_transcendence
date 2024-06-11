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
#python manage.py runserver 0.0.0.0:8000 
uvicorn backend.asgi:application --host 0.0.0.0 --port 8000  --port 443 --ssl-keyfile privkey.pem --ssl-certfile fullchain.pem