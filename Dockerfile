# Use the official Nginx image as the base image
FROM nginx:latest

# Copy the custom Nginx configuration file to the appropriate location
COPY nginx.conf /etc/nginx/nginx.conf

# Specify the directory where the application code will be mounted inside the container
ENV APP_DIR=/usr/share/nginx/html

# Set the working directory
WORKDIR $APP_DIR

# Copy the HTML files to the application directory inside the container
COPY html/ ./

# Expose port 80
EXPOSE 80

# Define a default command to run when the container starts
CMD ["nginx", "-g", "daemon off;"]