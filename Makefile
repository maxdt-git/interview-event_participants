.PHONY: install dev build lint lint-fix clean

install: ## Install dependencies
	npm install

dev: ## Start the dev server (http://localhost:5173)
	npm run dev

build: ## Type-check and build for production into dist/
	npm run build

lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint and auto-fix what can be fixed
	npm run lint -- --fix

clean: ## Remove build output and dependencies
	rm -rf dist node_modules
