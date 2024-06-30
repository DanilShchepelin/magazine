## Запуск проекта

```bash
  # Создать и настроить файл .env
  cp .env.example .env
```

### Первый запуск проекта в Docker

#### Билд приложения

```bash
  make app_build
```

#### Поднять проект в фоне или поднять и следить в консоли

```bash
  make start
```

```bash
  make start_live
```

#### Выключить проект

```bash
  make down
```

### Запуск тестов

#### Запустить приложение с тестовой средой

```bash
  make start_live_with_testing
```

```bash
  npm run test
```

## Документация

[Ссылка на swagger](http://localhost:3000/docs/)

*Только при запущенном проекте