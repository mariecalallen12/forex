.PHONY: help install dev build test clean docker-up docker-down k8s-deploy k8s-delete k8s-status monitor

# Colors for terminal output
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(CYAN)CME Trading Clone - Makefile Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# Development
install: ## Install dependencies
	@echo "$(CYAN)Installing dependencies...$(NC)"
	pnpm install

dev: ## Start all services in development mode
	@echo "$(CYAN)Starting development servers...$(NC)"
	@echo "$(YELLOW)API: http://localhost:3001$(NC)"
	@echo "$(YELLOW)Customer Web: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Admin Web: http://localhost:3002$(NC)"
	@echo "$(YELLOW)Realtime: http://localhost:3003$(NC)"
	pnpm dev

dev-api: ## Start API service only
	pnpm dev:api

dev-customer: ## Start Customer Web only
	pnpm dev:customer

dev-admin: ## Start Admin Web only
	pnpm dev:admin

dev-realtime: ## Start Realtime service only
	pnpm dev:realtime

# Build
build: ## Build all packages
	@echo "$(CYAN)Building all packages...$(NC)"
	pnpm build

build-api: ## Build API service
	pnpm build:api

build-customer: ## Build Customer Web
	pnpm build:customer

build-admin: ## Build Admin Web
	pnpm build:admin

# Testing
test: ## Run tests
	@echo "$(CYAN)Running tests...$(NC)"
	pnpm test

lint: ## Run linter
	@echo "$(CYAN)Running linter...$(NC)"
	pnpm lint

typecheck: ## Run TypeScript type checking
	@echo "$(CYAN)Running type checker...$(NC)"
	pnpm typecheck

# Docker Compose
docker-up: ## Start all services with Docker Compose
	@echo "$(CYAN)Starting Docker Compose...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Services started!$(NC)"
	@echo "$(YELLOW)API: http://localhost:3001$(NC)"
	@echo "$(YELLOW)Customer Web: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Admin Web: http://localhost:3002$(NC)"

docker-down: ## Stop all Docker Compose services
	@echo "$(CYAN)Stopping Docker Compose...$(NC)"
	docker-compose down

docker-logs: ## Show Docker Compose logs
	docker-compose logs -f

docker-ps: ## Show running containers
	docker-compose ps

docker-prod-up: ## Start production Docker Compose
	@echo "$(CYAN)Starting Production Docker Compose...$(NC)"
	docker-compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)Production services started!$(NC)"

docker-prod-down: ## Stop production Docker Compose
	docker-compose -f docker-compose.prod.yml down

# Kubernetes
k8s-deploy: ## Deploy to Kubernetes (production)
	@echo "$(CYAN)Deploying to Kubernetes...$(NC)"
	./scripts/deploy-k8s.sh prod

k8s-deploy-dev: ## Deploy to Kubernetes (development)
	@echo "$(CYAN)Deploying to Kubernetes (dev)...$(NC)"
	./scripts/deploy-k8s.sh dev

k8s-delete: ## Delete Kubernetes deployment
	@echo "$(RED)Deleting Kubernetes deployment...$(NC)"
	kubectl delete namespace cme-trading

k8s-status: ## Show Kubernetes deployment status
	@echo "$(CYAN)Kubernetes Status:$(NC)"
	kubectl get all -n cme-trading

k8s-pods: ## Show Kubernetes pods
	kubectl get pods -n cme-trading

k8s-logs-api: ## Show API logs
	kubectl logs -f -n cme-trading deployment/api

k8s-logs-realtime: ## Show Realtime logs
	kubectl logs -f -n cme-trading deployment/realtime

k8s-logs-customer: ## Show Customer Web logs
	kubectl logs -f -n cme-trading deployment/customer-web

k8s-logs-admin: ## Show Admin Web logs
	kubectl logs -f -n cme-trading deployment/admin-web

k8s-shell-api: ## Open shell in API pod
	kubectl exec -it -n cme-trading deployment/api -- sh

k8s-port-forward: ## Port forward all services
	@echo "$(CYAN)Port forwarding services...$(NC)"
	@echo "$(YELLOW)API: http://localhost:3001$(NC)"
	@echo "$(YELLOW)Customer Web: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Admin Web: http://localhost:3002$(NC)"
	@echo "$(YELLOW)Realtime: http://localhost:3003$(NC)"
	kubectl port-forward -n cme-trading svc/api-service 3001:3001 & \
	kubectl port-forward -n cme-trading svc/customer-web-service 3000:3000 & \
	kubectl port-forward -n cme-trading svc/admin-web-service 3002:3002 & \
	kubectl port-forward -n cme-trading svc/realtime-service 3003:3003

# Monitoring
monitor: ## Open monitoring dashboards
	@echo "$(CYAN)Opening monitoring dashboards...$(NC)"
	@echo "$(YELLOW)Prometheus: http://localhost:9090$(NC)"
	@echo "$(YELLOW)Grafana: http://localhost:3000 (admin/changeme)$(NC)"
	kubectl port-forward -n cme-trading svc/prometheus-service 9090:9090 & \
	kubectl port-forward -n cme-trading svc/grafana-service 3000:3000

prometheus: ## Open Prometheus
	@echo "$(CYAN)Opening Prometheus...$(NC)"
	@echo "$(YELLOW)Prometheus: http://localhost:9090$(NC)"
	kubectl port-forward -n cme-trading svc/prometheus-service 9090:9090

grafana: ## Open Grafana
	@echo "$(CYAN)Opening Grafana...$(NC)"
	@echo "$(YELLOW)Grafana: http://localhost:3000 (admin/changeme)$(NC)"
	kubectl port-forward -n cme-trading svc/grafana-service 3000:3000

# Database
db-migrate: ## Run database migrations
	@echo "$(CYAN)Running database migrations...$(NC)"
	cd services/api && pnpm migration:run

db-connect: ## Connect to PostgreSQL database
	@echo "$(CYAN)Connecting to database...$(NC)"
	kubectl exec -it -n cme-trading postgres-0 -- psql -U postgres -d cme_trading

# Cleanup
clean: ## Clean build artifacts
	@echo "$(CYAN)Cleaning build artifacts...$(NC)"
	pnpm clean
	rm -rf node_modules
	rm -rf */node_modules
	rm -rf */*/node_modules

clean-docker: ## Remove Docker volumes and images
	@echo "$(RED)Removing Docker volumes and images...$(NC)"
	docker-compose down -v
	docker system prune -af

# Documentation
docs: ## Open documentation
	@echo "$(CYAN)Documentation:$(NC)"
	@echo "$(YELLOW)README: ./README.md$(NC)"
	@echo "$(YELLOW)Quick Start: ./QUICKSTART.md$(NC)"
	@echo "$(YELLOW)Kubernetes Guide: ./docs/KUBERNETES.md$(NC)"
	@echo "$(YELLOW)Monitoring Guide: ./docs/MONITORING.md$(NC)"
	@echo "$(YELLOW)API Docs: ./docs/API.md$(NC)"
	@echo "$(YELLOW)Progress Report: ./BAO_CAO_TIEN_DO.md$(NC)"

# Health checks
health: ## Check service health
	@echo "$(CYAN)Checking service health...$(NC)"
	@curl -f http://localhost:3001/health && echo "$(GREEN)✓ API healthy$(NC)" || echo "$(RED)✗ API unhealthy$(NC)"
	@curl -f http://localhost:3003/health && echo "$(GREEN)✓ Realtime healthy$(NC)" || echo "$(RED)✗ Realtime unhealthy$(NC)"
	@curl -f http://localhost:3000 && echo "$(GREEN)✓ Customer Web healthy$(NC)" || echo "$(RED)✗ Customer Web unhealthy$(NC)"
	@curl -f http://localhost:3002 && echo "$(GREEN)✓ Admin Web healthy$(NC)" || echo "$(RED)✗ Admin Web unhealthy$(NC)"

# CI/CD
ci: lint typecheck build test ## Run CI pipeline locally

.DEFAULT_GOAL := help
