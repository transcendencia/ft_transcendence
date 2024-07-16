FROM python:3.9
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
WORKDIR /backend
COPY requirements_cron.txt /backend
COPY . /backend/
RUN apt-get update && apt-get install -y \
    postgresql-client \
    cron \
    && pip install django psycopg2-binary \ 
    && apt-get clean \ 
    && rm -rf /var/lib/apt/lists/*
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r ./requirements_cron.txt
RUN pip install djangorestframework
RUN pip install django-password-validators
RUN python -m pip install Pillow
RUN apt-get install -y cron
RUN mkdir -p /backend/logs && chmod 777 /backend/logs
COPY crontab /etc/cron.d/django-cron
RUN chmod 0644 /etc/cron.d/django-cron
RUN crontab /etc/cron.d/django-cron
COPY launch_crontab.sh /etc/launch_crontab.sh
RUN chmod +x /etc/launch_crontab.sh
# Copie du script connect_to_postgres.sh et rendu exécutable

CMD ["bash", "./launch_script.sh"]