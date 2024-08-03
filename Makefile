# # ---- Directories ---- #

include .env

DOCKER_COMPOSE = docker-compose.yml

# # ---- Launch rules ---- #

all:
	@mkdir -p backend/cert
	@openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout backend/cert/key.pem -out backend/cert/cert.pem -subj "/CN=localhost" 
	@docker compose -f ${DOCKER_COMPOSE} up -d --build

up: 
	@docker compose -f ${DOCKER_COMPOSE} up

cert:
	@mkdir -p backend/cert
	@openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout backend/cert/key.pem -out backend/cert/cert.pem -subj "/CN=localhost"

detach:
	@docker compose -f ${DOCKER_COMPOSE} up -d

down:
	@docker compose -f ${DOCKER_COMPOSE} down


# # ---- Clean rules ---- #

prune:
	@docker compose -f ${DOCKER_COMPOSE} stop
	@rm -rf backend/cert
	@docker system prune -a;
	@docker volume prune;

fclean:
	- @docker compose -f ${DOCKER_COMPOSE} down --rmi all -v --remove-orphans
	- @find backend/media -type f ! -name 'default.png' ! -name 'botLogo.png' -delete
	- @rm -rf backend/cert

re: down
	@rm -rf backend/cert
	${MAKE} all


migration:
	 rm -rf backend/authentication/migrations
	- @docker compose -f ${DOCKER_COMPOSE} down --rmi all -v --remove-orphans
	- @find backend/media -type f ! -name 'default.png' ! -name 'botLogo.png' -delete
	${MAKE} all
	
.PHONY: all fclean up down
