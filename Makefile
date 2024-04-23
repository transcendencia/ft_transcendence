# # ---- Directories ---- #

include .env

DOCKER_COMPOSE = docker-compose.yml

# # ---- Launch rules ---- #

all:
	chmod +x setpath.sh
	bash setpath.sh
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
	- @docker-compose -f ${DOCKER_COMPOSE} down --rmi all -v --remove-orphans
	- @docker system prune --all --force
	- @docker volume prune --force
	- @docker network prune --force


re: down
	${MAKE} all

.PHONY: all fclean up down
