.PHONY: help dev prod build up down restart logs clean status shell db-shell db-migrate db-seed db-reset health test lint

# Default target
.DEFAULT_GOAL := help

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

# Variables
COMPOSE := docker compose
APP_CONTAINER := se-project-app
DB_CONTAINER := se-project-db
DEV_ENV := dev.env
PROD_ENV := prod.env

help: ## Show this help message
	@echo "$(BLUE)SE Project - Docker Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# Setup and Start
dev: ## Start development environment (with local database)
	@if [ ! -f $(DEV_ENV) ]; then \
		echo "$(YELLOW)$(DEV_ENV) not found! Creating from .env.dev.example...$(NC)"; \
		cp .env.dev.example $(DEV_ENV); \
		echo "$(YELLOW)Please update $(DEV_ENV) with your values$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Starting development with local database...$(NC)"
	$(COMPOSE) --profile dev --env-file $(DEV_ENV) up -d
	@echo "$(GREEN)Development started at http://localhost:3000$(NC)"
	@echo "$(BLUE)Database: localhost:5432$(NC)"

prod: ## Start production environment (uses external Neon database)
	@if [ ! -f $(PROD_ENV) ]; then \
		echo "$(YELLOW)$(PROD_ENV) not found! Creating from .env.prod.example...$(NC)"; \
		cp .env.prod.example $(PROD_ENV); \
		echo "$(YELLOW)Please update $(PROD_ENV) with your Neon database URL$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Starting production (app only)...$(NC)"
	@echo "$(YELLOW)Note: Using external Neon database$(NC)"
	$(COMPOSE) --env-file $(PROD_ENV) up -d app
	@echo "$(GREEN)Production started at http://localhost:3000$(NC)"
	@echo "$(BLUE)Database: External Neon (serverless)$(NC)"

build: ## Build Docker images (use: make build env=prod for production)
	@echo "$(BLUE)Building images...$(NC)"
	@if [ "$(env)" = "prod" ]; then \
		$(COMPOSE) --env-file $(PROD_ENV) build --no-cache app; \
	else \
		$(COMPOSE) --env-file $(DEV_ENV) build --no-cache; \
	fi

up: ## Start containers with dev environment
	$(COMPOSE) --profile dev --env-file $(DEV_ENV) up -d

down: ## Stop all containers
	@echo "$(BLUE)Stopping containers...$(NC)"
	$(COMPOSE) --profile dev down
	$(COMPOSE) down

restart: ## Restart containers (use: make restart env=prod for production)
	@echo "$(BLUE)Restarting...$(NC)"
	@if [ "$(env)" = "prod" ]; then \
		$(COMPOSE) --env-file $(PROD_ENV) restart; \
	else \
		$(COMPOSE) --env-file $(DEV_ENV) restart; \
	fi

# Logs
logs: ## Show logs (use: make logs f=1 for follow)
	@if [ "$(f)" = "1" ]; then \
		$(COMPOSE) logs -f; \
	else \
		$(COMPOSE) logs; \
	fi

# Status
status: ## Show container status
	@$(COMPOSE) ps

ps: status ## Alias for status

health: ## Check application health
	@curl -f http://localhost:3000/api/health || echo "$(YELLOW)Health check failed$(NC)"

# Shell Access
shell: ## Open shell in app container
	@docker exec -it $(APP_CONTAINER) sh

db-shell: ## Open PostgreSQL shell
	@docker exec -it $(DB_CONTAINER) psql -U postgres -d se_project

# Database
db-migrate: ## Run database migrations
	@echo "$(BLUE)Running migrations...$(NC)"
	@docker exec $(APP_CONTAINER) npx prisma migrate deploy

db-seed: ## Seed database
	@echo "$(BLUE)Seeding database...$(NC)"
	@docker exec $(APP_CONTAINER) pnpm run seats:all
	@docker exec $(APP_CONTAINER) pnpm run flight:all

db-reset: ## Reset database
	@echo "$(YELLOW)Reset database? [y/N]$(NC)" && read ans && [ $${ans:-N} = y ]
	@$(MAKE) db-migrate
	@$(MAKE) db-seed

db-backup: ## Backup database
	@mkdir -p backups
	@docker exec $(DB_CONTAINER) pg_dump -U postgres se_project > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Backup created in backups/$(NC)"

# Testing
test: ## Run tests
	@docker exec $(APP_CONTAINER) pnpm test

lint: ## Run linter
	@docker exec $(APP_CONTAINER) pnpm lint

# Cleanup
clean: ## Remove containers and volumes
	@echo "$(YELLOW)Remove all containers and volumes? [y/N]$(NC)" && read ans && [ $${ans:-N} = y ]
	@$(COMPOSE) down -v
	@echo "$(GREEN)Cleaned up$(NC)"

prune: ## Prune Docker system
	@echo "$(YELLOW)Prune unused Docker resources? [y/N]$(NC)" && read ans && [ $${ans:-N} = y ]
	@docker system prune -a --volumes

# Environment Setup
env-setup: ## Setup environment files
	@if [ ! -f $(DEV_ENV) ]; then \
		cp .dev.env.example $(DEV_ENV); \
		echo "$(GREEN)$(DEV_ENV) created!$(NC)"; \
	else \
		echo "$(YELLOW)$(DEV_ENV) already exists$(NC)"; \
	fi
	@if [ ! -f $(PROD_ENV) ]; then \
		cp .prod.env.example $(PROD_ENV); \
		echo "$(GREEN)$(PROD_ENV) created!$(NC)"; \
	else \
		echo "$(YELLOW)$(PROD_ENV) already exists$(NC)"; \
	fi
	@echo "$(BLUE)Generated NEXTAUTH_SECRET (copy to your .env files):$(NC)"
	@openssl rand -base64 32

env-secret: ## Generate NEXTAUTH_SECRET
	@echo "$(BLUE)Generated NEXTAUTH_SECRET:$(NC)"
	@openssl rand -base64 32

# Installation
install: ## Full setup (env + build + dev + migrate)
	@echo "$(BLUE)Setting up project...$(NC)"
	@$(MAKE) env-setup
	@echo ""
	@echo "$(YELLOW)Please update $(DEV_ENV) and $(PROD_ENV) with the generated secret above$(NC)"
	@echo "$(YELLOW)Then run: make build && make dev && make db-migrate && make db-seed$(NC)"
