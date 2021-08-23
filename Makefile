#!/bin/bash 
TEST_IMAGE_NAME=backoffice-qa-automation
NETWORK_NAME=multigaming-backoffice-qa-automation
NETWORK_ID=$(shell docker network ls -qf "name=${NETWORK_NAME}")

.PHONY: add-network
add-network:
	@if [ -n '${NETWORK_ID}' ]; then \
		echo 'The ${NETWORK_NAME} network already exists. Skipping...'; \
	else \
		docker network create -d bridge ${NETWORK_NAME}; \
	fi

build:
	docker build -t ${TEST_IMAGE_NAME} .

build.cleanup:
	docker rmi ${TEST_IMAGE_NAME}

run.bash:
	docker run -it --mount type=bind,source="/home/gamersclub/projetos/Projeto Pipeline/multigaming-automated-tests",target=/app --shm-size 512M --network=gamersclub_multigaming_dev ${TEST_IMAGE_NAME} bash 

run:
	docker run --shm-size 512M --network=${NETWORK_NAME} -v ${pwd}/cypress:/app/cypress ${TEST_IMAGE_NAME} npm run cy:ci_run

update_submodules:
	git submodule update --recursive --init --remote

cleanup_projects:
	(cd projects/gamersclub-multigaming-backend && sudo rm -rf node_modules)
	(cd projects/gamersclub-multigaming-backend && sudo rm -rf dist)
	(cd projects/gamersclub-multigaming-backoffice-frontend && sudo rm -rf node_modules)

setup: add-network
	(cd projects/gamersclub-multigaming-backend && cp .env.example .env)
	(cd projects/gamersclub-multigaming-backoffice-frontend && cp .env.example .env.local)

	cat backend.env >> projects/gamersclub-multigaming-backend/.env
	cat frontend.env >> projects/gamersclub-multigaming-backoffice-frontend/.env.local
	cat chat.env >> projects/gamersclub-multigaming-service-chat/docker/development/.env

	(cd projects/gamersclub-multigaming-backend && docker-compose build)
	(cd projects/gamersclub-multigaming-backoffice-frontend && docker-compose build)
	@if [ -n '${VERDACCIO_USER}' ]; then \
		touch ./projects/gamersclub-multigaming-backend/.npmrc_config; \
		touch ./projects/gamersclub-multigaming-backoffice-frontend/.npmrc_config; \
	else \
		cp ~/.npmrc projects/gamersclub-multigaming-backend/.npmrc_config; \
		cp ~/.npmrc projects/gamersclub-multigaming-backoffice-frontend/.npmrc_config; \
	fi
	(docker-compose -f ./projects/gamersclub-multigaming-service-chat/docker/development/docker-compose.yml -f ./docker-compose.chat.yml up --remove-orphans -d)
	(docker-compose -f ./projects/gamersclub-multigaming-backend/docker-compose.yml -f ./docker-compose.backend.yml up --remove-orphans -d)
	(docker-compose -f ./projects/gamersclub-multigaming-backoffice-frontend/docker-compose.yml -f ./docker-compose.frontend.yml up --remove-orphans -d)

wait_for_environment:
	docker run --network=${NETWORK_NAME} ${TEST_IMAGE_NAME} curl -XGET --retry-all-errors --retry 30 --retry-delay 25 http://gamersclub-multigaming-backoffice-frontend:8081

teardown:
	(docker-compose -f ./projects/gamersclub-multigaming-backend/docker-compose.yml -f ./docker-compose.backend.yml down)
	(docker-compose -f ./projects/gamersclub-multigaming-backoffice-frontend/docker-compose.yml -f ./docker-compose.frontend.yml down)
	(docker-compose -f ./projects/gamersclub-multigaming-service-chat/docker/development/docker-compose.yml -f ./docker-compose.chat.yml down)
	docker volume rm gamersclub-multigaming-backend_gamersclub-backoffice-qa-backend-mysql-volume
	docker volume rm gamersclub-multigaming-backend_gamersclub-backoffice-qa-backend-redis-volume
	docker volume rm development_gamersclub-backoffice-qa-chat-cassandra-volume

