# # ---- Directories ---- #

include .env

DOCKER_COMPOSE = docker-compose.yml

# # ---- Launch rules ---- #

all:
	@docker compose -f ${DOCKER_COMPOSE} up -d --build 

up: 
	@docker compose -f ${DOCKER_COMPOSE} up


detach:
	@docker compose -f ${DOCKER_COMPOSE} up -d

down:
	@docker compose -f ${DOCKER_COMPOSE} down


# # ---- Clean rules ---- #

prune:
	@docker compose -f ${DOCKER_COMPOSE} stop
	@docker system prune -a;
	@docker volume prune;

fclean:
	- @docker compose -f ${DOCKER_COMPOSE} down --rmi all -v --remove-orphans
	- @find backend/media -type f ! -name 'default.png' ! -name 'botLogo.png' -delete

re: down
	${MAKE} all


migration:
	sudo rm -rf backend/authentication/migrations
	- @docker compose -f ${DOCKER_COMPOSE} down --rmi all -v --remove-orphans
	- @find backend/media -type f ! -name 'default.png' ! -name 'botLogo.png' -delete
	${MAKE} all
	
.PHONY: all fclean up down
