# Lastest version of PostgreSQL 
FROM postgres:16-alpine

#Port to listen 
EXPOSE 5432

# Environment variables
ENV POSTGRES_USER=lciullo
ENV POSTGRES_PASSWORD=test
ENV POSTGRES_DB=db

#debug rules a enlever 
CMD ["tail", "-f", "/dev/null"]