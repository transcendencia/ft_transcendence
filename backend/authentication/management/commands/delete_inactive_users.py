import logging
from django.core.management.base import BaseCommand
from django.utils import timezone
from ...models import User
logger = logging.getLogger(__name__)
from datetime import datetime
from ...utils.constants import UserStatus

class Command(BaseCommand):
    def handle(self, *args, **options):
        try:
            today = datetime.now()
            try:
                twoYearsAgo = today.replace(year=today.year - 2)
            except ValueError:
                twoYearsAgo = today.replace(year=today.year - 2, day=28)
            usersToDelete = User.objects.filter(last_login_date=twoYearsAgo)
            for user in usersToDelete:
                if user.status is not UserStatus.ONLINE:
                    user.delete()
        except Exception as e:
            pass