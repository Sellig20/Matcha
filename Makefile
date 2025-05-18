DIST_DIR := backend/dist
NM := node_modules
BNM := backend/node_modules
FNM := frontend/node_modules

all: up

up:
	@echo "INFO: Building images, and starting containers..."
	docker compose up --build --force-recreate

down:
	@echo "INFO: Stopping and removing Docker Compose services, networks, and volumes..."
	docker compose down -v

ps:
	@echo "INFO: Docker Compose services status:"
	docker compose ps -a
	@echo "\nINFO: All Docker containers status:"
	docker ps -a

clean:
	@echo "INFO: Cleaning project build artifacts and local dependencies..."
	rm -rf $(DIST_DIR)
	rm -rf $(NM)
	rm -rf $(BNM)
	rm -rf $(FNM)
	@echo "INFO: Project cleaning complete."

fclean: down
	@echo "INFO: Performing a full system cleanup..."
	@echo "INFO: Pruning unused Docker objects (system, volumes, builder cache, images)..."
	docker system prune -a -f
	docker volume prune -a -f
	docker builder prune -f
	docker image prune -f
	@echo "INFO: Cleaning project build artifacts and local dependencies (as part of fclean)..."
	rm -rf $(DIST_DIR)
	rm -rf $(NM)
	rm -rf $(BNM)
	rm -rf $(FNM)
	@echo "INFO: Full system cleanup complete."

re: clean up
	@echo "INFO: Application rebuilt (project cleaned and services restarted)."

front:
	@echo "INFO: Accessing bash shell in 'front-end' container..."
	docker exec -it front-end bash

back:
	@echo "INFO: Accessing bash shell in 'back-end' container..."
	docker exec -it back-end bash

db:
	@echo "INFO: Accessing bash shell in 'db' container..."
	docker exec -it db bash

.PHONY: all up down ps clean fclean re front back db
