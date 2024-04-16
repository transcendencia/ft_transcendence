# # Use the official Nginx image as the base image
# FROM nginx:latest

# # Expose port 80
# EXPOSE 8000

# # Copy the custom Nginx configuration file to the appropriate location
# COPY conf/nginx.conf /etc/nginx/nginx.conf

# # Specify the directory where the application code will be mounted inside the container
# ENV APP_DIR=/usr/share/nginx/html

# # Set the working directory
# WORKDIR $APP_DIR



# # Define a default command to run when the container starts
# CMD ["nginx", "-g", "daemon off;"]

# CMD ["spleep", "2000"]
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
RUN apt-get -y update && apt-get -y upgrade 

RUN	pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

RUN pip install django

RUN pip install python-dotenv

RUN pip install psycopg2

# # Copy the HTML files to the application directory inside the container
# COPY html /usr/share/nginx/html/.

#Install python on my docker 
#RUN apt-get install netcat-traditional

CMD ["bash", "ft_transcendence/run_server.sh"]