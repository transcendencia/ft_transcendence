FROM nginx:stable-alpine

EXPOSE 443

RUN  rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d

# # Copy the built frontend files into the Nginx default HTML directory
COPY html /usr/share/nginx/html




# Command to start Nginx within the container
CMD ["nginx", "-g", "daemon off;"]
