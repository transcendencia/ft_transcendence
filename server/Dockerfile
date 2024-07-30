FROM python:3.9
EXPOSE 8000
ENV	PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /backend 
COPY requirements.txt /backend
COPY . /backend/
RUN apt-get -y update && apt-get -y upgrade && apt install netcat-traditional
RUN	pip install --upgrade pip
RUN pip install --no-cache-dir -r ./requirements.txt
RUN pip install djangorestframework
RUN pip install django-password-validators
RUN python -m pip install Pillow
RUN pip install gunicorn uvicorn
RUN mkdir -p /backend/logs && chmod 777 /backend/logs
CMD ["bash", "./run_server.sh"]