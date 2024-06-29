import logging
from django.core.management.base import BaseCommand
from django.utils import timezone

logger = logging.getLogger(__name__)

import logging
from django.core.management.base import BaseCommand
from django.utils import timezone

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Delete inactive users'

    def handle(self, *args, **options):
        message = f"Cron job executed at {timezone.now()}"
        print(message)
        logger.info(message)
        
        with open('/backend/logs/cron_execution.log', 'a') as f:
            f.write(message + '\n')
        
        # Votre logique ici
        
        logger.info("Cron job completed")