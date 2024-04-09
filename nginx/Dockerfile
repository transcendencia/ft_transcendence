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

# # Copy the HTML files to the application directory inside the container
# COPY html /usr/share/nginx/html/.

# # Define a default command to run when the container starts
# CMD ["nginx", "-g", "daemon off;"]

# CMD ["spleep", "2000"]

FROM python

# Expose port 80
EXPOSE 8000

#Install python on my docker 
RUN python -m pip install Django


CMD ["python", "manage.py", "runserver"]

CMD ["sleep", "2000"]