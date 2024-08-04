#!/bin/bash
if [ "$POSTGRES_HOST" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Attendre que le serveur soit prêt
echo "Waiting for server..."
until nc -z server 8000; do
  echo "Waiting for server connection."
  sleep 1
done
echo "Server started"

echo "Cron started"

chmod +x launch_cron.sh
./launch_cron.sh