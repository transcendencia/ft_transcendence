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

RUN	pip install --upgrade pip

RUN pip install --no-cache-dir -r ./requirements.txt

RUN pip install djangorestframework

RUN pip install django-password-validators

RUN python -m pip install Pillow

RUN apt-get install -y cron && touch /var/log/cron.log
RUN mkdir /cron
RUN touch /cron/django_cron.log

CMD ["bash", "run_server.sh"]
