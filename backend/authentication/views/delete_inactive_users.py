from ... models import User
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from datetime import timedelta

def deleteInactiveUser():
    print("On rentre dans la fonction crontab")