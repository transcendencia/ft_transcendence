FROM python:3.9

# Expose port 80
EXPOSE 8000

#Usefull to get logs
ENV	PYTHONUNBUFFERED 1

ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /backend 

COPY requirements.txt /backend

COPY . /backend/

#Update 
RUN apt-get -y update && apt-get -y upgrade && apt install netcat-traditional

RUN apt-get -y update && apt-get -y upgrade cron 

RUN	pip install --upgrade pip

RUN pip install --no-cache-dir -r ./requirements.txt

RUN pip install djangorestframework

RUN pip install django-password-validators

RUN python -m pip install Pillow

# Create necessary directories and log files
COPY conf/cron.conf /etc/cron.d/cron.conf

# Ensure the crontab is added for the root user
RUN echo "* * * * * root /usr/bin/python /backend/manage.py crontab run >> /cron/django_cron.log 2>&1" >> /etc/crontab

CMD ["bash", "run_server.sh"]
