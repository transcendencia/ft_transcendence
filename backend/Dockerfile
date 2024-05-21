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
#RUN pip install django

#RUN pip install whitenoise

#RUN pip install python-dotenv

#RUN pip install psycopg2

CMD ["bash", "run_server.sh"]

# # Copy the HTML files to the application directory inside the container
# COPY html /usr/share/nginx/html/.

#Install python on my docker 
#RUN apt-get install netcat-traditional

# SERVER A CHOISIR 