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
FROM python

# Expose port 80
EXPOSE 8000
EXPOSE 8001

#Update 
RUN apt-get -y update && apt-get -y upgrade 

# # Copy the HTML files to the application directory inside the container
# COPY html /usr/share/nginx/html/.

#Install python on my docker 
RUN python -m pip install Django

RUN apt-get install netcat-traditional

CMD ["python", "/django/server/manage.py", "runserver", "0.0.0.0:8000"]
