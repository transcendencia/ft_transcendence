FROM python:3.9
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /backend
COPY requirements_cron.txt /backend
COPY /backend /backend
COPY launch_script.sh /backend
COPY launch_cron.sh /backend
RUN apt-get update && apt-get install -y \
    postgresql-client \
    cron \
    netcat-traditional \
    && pip install django psycopg2-binary \ 
    && apt-get clean \ 
    && rm -rf /var/lib/apt/lists/*
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r ./requirements_cron.txt
RUN pip install djangorestframework
RUN pip install django-password-validators
RUN python -m pip install Pillow
RUN apt-get install -y cron
COPY crontab /etc/cron.d/django-cron
RUN chmod 0644 /etc/cron.d/django-cron
RUN crontab /etc/cron.d/django-cron
RUN mkdir -p /backend/logs && chmod 777 /backend/logs
COPY launch_crontab.sh /etc/launch_crontab.sh
RUN chmod +x /etc/launch_crontab.sh
RUN chmod +x  /backend/launch_script.sh
RUN chmod +x  /backend/launch_cron.sh
CMD ["bash", "./launch_script.sh"]