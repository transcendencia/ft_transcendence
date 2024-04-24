# Lastest version of PostgreSQL 
FROM postgres:16-alpine

#Port to listen 
EXPOSE 5432

# Environment variables
ENV POSTGRES_USER=cllovio
ENV POSTGRES_PASSWORD=test
ENV POSTGRES_DB=db

# COPY /database/ /var/lib/postgresql/data/

# RUN chmod -R ugo+rx /var/lib/postgresql/data

#debug rules a enlever 
#CMD ["tail", "-f", "/dev/null"]