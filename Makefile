DIST_DIR=backend/dist
NM=node_modules
BNM=backend/node_modules
FNM=frontend/node_modules

all: up

up:
	npm install && docker compose up --build --force-recreate #>> logs.txt #-d
	
down:
	docker compose down -v

ps:		
	docker compose ps -a
	docker ps -a

fclean:	down
	docker system prune --force
	docker volume prune --force
	rm -rf $(DIST_DIR)
	rm -rf $(NM)
	rm -rf $(BNM)
	rm -rf $(FNM)

re : 	clean up

db: 
	docker exec -it db bash

back-end: 
	docker exec -it back-end bash

front-end: 
	docker exec -it front-end bash

.PHONY: up down re ps clean front-end back-end db