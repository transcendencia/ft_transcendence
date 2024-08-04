#!/bin/bash 

if [ "$POSTGRES_HOST" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi


sleep 15

while true; do
  python manage.py shell <<EOF
from authentication.models import User
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta

now = timezone.now()
fifteenSecondsAgo = now - timedelta(seconds=21)

usersToLogout = User.objects.filter(
    ~Q(last_ping__isnull=True) & Q(last_ping__lt=fifteenSecondsAgo) & ~Q(username="bot") & ~Q(status="offline")
)

for user in usersToLogout:
    user.status = "offline"
    user.save()
    if user.auth_token:
        user.auth_token.delete()
EOF
sleep 20
done