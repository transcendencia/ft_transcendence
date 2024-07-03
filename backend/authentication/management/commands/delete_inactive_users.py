import logging
from django.core.management.base import BaseCommand
from django.utils import timezone
from ...models import User
logger = logging.getLogger(__name__)


from datetime import datetime
from dateutil.relativedelta import relativedelta

class Command(BaseCommand):
    help = 'Delete inactive users'

    def handle(self, *args, **options):
        try:
            message = f"Cron job executed at {timezone.now()}"
            print(message)
            logger.info(message)
            
            with open('/backend/logs/cron_execution.log', 'a') as f:
                f.write(message + '\n')
            twoYearsAgo = datetime.now() - relativedelta(years=2)
            usersToDelete = User.objects.filter(last_login_date=twoYearsAgo)
            for user in usersToDelete:
                print(f'Utilisateur: {user.username}')
                user.delete()
                # User.objects.filter(last_login_date=timezone.now() - timedelta(days=30)).delete()
            # Votre logique ici
            # Par exemple :
            # 
            
            completion_message = f"Cron job completed at {timezone.now()}"
            print(completion_message)
            logger.info(completion_message)
            
            with open('/backend/logs/cron_execution.log', 'a') as f:
                f.write(completion_message + '\n')

        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            print(error_message)
            logger.error(error_message)
            
            with open('/backend/logs/cron_execution.log', 'a') as f:
                f.write(error_message + '\n')