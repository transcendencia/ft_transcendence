# Use the official Nginx image as the base image
FROM nginx:latest

# Copy the custom Nginx configuration file to the appropriate location
COPY nginx.conf /etc/nginx/nginx.conf

# Copy HTML files to the Nginx default html directory
COPY html /usr/share/nginx/html
