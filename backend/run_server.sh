#!/bin/bash 

# Fonction pour vérifier si la base de données est prête
# wait_for_db() {
#   local tries=0
#   echo "Vérification de la disponibilité de la base de données..."

#   while ! nc -z $POSTGRES_HOST $POSTGRES_PORT &>/dev/null; do
#     tries=$((tries+1))
#     if [ $tries -gt $MAX_TRIES ]; then
#       echo "Échec : Impossible de se connecter à la base de données après $MAX_TRIES tentatives."
#       exit 1
#     fi
#     echo "La base de données n'est pas encore disponible. Tentative $tries/$MAX_TRIES..."
#     sleep 0.1
#   done

#   echo "La base de données est disponible. Démarrage du serveur Django..."
# }

# # Appel de la fonction wait_for_db
# wait_for_db

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
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000