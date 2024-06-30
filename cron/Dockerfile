FROM python:3.9
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
WORKDIR /backend
COPY requirements_cron.txt /backend
COPY . /backend/
RUN apt-get -y update && apt-get -y upgrade
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

CMD ["cron", "-f"]