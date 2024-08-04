FROM python:3.9
EXPOSE 8000
ENV	PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /backend 
COPY /backend /backend
COPY requirements.txt /backend
COPY run_processes.sh /backend
COPY run_logout.sh /backend
COPY run_server.sh /backend 
RUN apt-get -y update && apt-get -y upgrade && apt install netcat-traditional
RUN	pip install --upgrade pip
RUN pip install --no-cache-dir -r ./requirements.txt
RUN pip install djangorestframework
RUN pip install django-password-validators
RUN python -m pip install Pillow
RUN pip install gunicorn uvicorn
RUN chmod +x /backend/run_processes.sh 
RUN chmod +x /backend/run_logout.sh 
RUN chmod +x /backend/run_server.sh  
CMD ["bash", "./run_processes.sh"]