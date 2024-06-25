# Запуск приложение в фон
start:
	make shared_start
	make app_start

# Запуск приложение и node приложение останется активным процессов в консоли
start_live:
	make shared_start
	make app_start_live

# Выключение приложения
down:
	make app_down
	make shared_down

# Запуск зависимостей для приложения (бд и прочие сервисы)
shared_start:
	docker compose -f docker-compose.shared.yml up -d

# Выключение зависимостей
shared_down:
	docker compose -f docker-compose.shared.yml down

# Запуск node контейнера в фоне
app_start:
	docker compose up -d

# Выключить node контейнер и оставить активным процессом в консоли
app_start_live:
	docker compose up

# Выключить node контейнер
app_down:
	docker compose down

# Пересобрать node контейнер (когда надо обновить зависимости проекта и прочее)
app_build:
	docker compose build