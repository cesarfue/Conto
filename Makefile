all: dev

dev:
	@docker compose -f docker-compose.yml -f docker-compose.override.yml up -d --build

prod:
	@docker compose up -d --build

down:
	@docker compose down

stop:
	@docker compose stop

start:
	@docker compose start

db:
	@docker exec -it mysql-db mysql -u root -p

clean:
	@docker compose down --volumes --remove-orphans

clean-volumes:
	@docker volume rm $$(docker volume ls -q)

re:
	@$(MAKE) clean
	@$(MAKE) dev
