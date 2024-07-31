FROM nginx:stable-alpine3.17

EXPOSE 443

COPY --chown=nginx:nginx ./certs/cert.pem /etc/nginx/certs/
COPY --chown=nginx:nginx ./certs/key.pem /etc/nginx/certs/

RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]