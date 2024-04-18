# # ---- Directories ---- #

include .env

DOCKER_COMPOSE = docker-compose.yml

# # ---- Launch rules ---- #

all:
	docker compose -f ${DOCKER_COMPOSE} up -d --build


up: 
	docker compose -f ${DOCKER_COMPOSE} up -d


down:
	docker compose -f ${DOCKER_COMPOSE} down


# # ---- Clean rules ---- #

prune:
	docker compose -f ${DOCKER_COMPOSE} stop
	docker system prune -a;
	docker volume prune;

fclean:
	- @docker compose -f ${DOCKER_COMPOSE} down --rmi all -v --remove-orphans
	- @docker ps -aq | xargs docker stop | xargs docker rm
	- @docker system prune --all --force
	- @docker volume prune --force
	- @docker network prune --force


re: down
	${MAKE} all

.PHONY: all fclean up down
