# Define the Docker Compose file
COMPOSE_FILE=docker-compose.yml

# Default target: build and start the Docker containers
.DEFAULT_GOAL := build_up

# Display help message
.PHONY: help
help:
	@echo "Usage: make [TARGET]"
	@echo ""
	@echo "Targets:"
	@echo "  build       Build the Docker containers"
	@echo "  up          Start the Docker containers"
	@echo "  down        Stop the Docker containers"
	@echo "  clean       Remove Docker build cache"
	@echo "  fclean      Stop the Docker containers and remove all associated resources"
	@echo "  re          Restart the Docker containers"
	@echo "  build_up    Build and start the Docker containers"

# Build the Docker containers
.PHONY: build
build:
	sudo chmod 777 ./data
	docker compose build

# Start the Docker containers in detached mode
.PHONY: up
up:
	docker compose up -d

# Stop the Docker containers
.PHONY: down
down:
	docker compose down

# Remove Docker build cache
.PHONY: clean
clean:
	docker builder prune -f
	docker image prune -f

# Stop the Docker containers and remove all associated resources
.PHONY: fclean
fclean:
	docker compose down --rmi all --volumes --remove-orphans
	docker builder prune -a -f
	docker image prune -a -f
	docker volume prune -f
	docker network prune -f

# Restart the Docker containers
.PHONY: re
re: fclean build up

# Build and start the Docker containers
.PHONY: build_up
build_up: build up
