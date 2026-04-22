# E-commerce Microservices (FastAPI)

В проекте реализованы два микросервиса согласно ТЗ:

- `products_service` — управление товарами
- `orders_service` — управление заказами

> Микросервис админ-панели на данном этапе не реализуется.
> Аутентификация/авторизация не используются.

## Быстрый запуск

1. Установить зависимости:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Указать переменные окружения (опционально, есть значения по умолчанию):

- `PRODUCTS_DATABASE_URL` (по умолчанию `postgresql+psycopg2://postgres:postgres@localhost:5432/products_db`)
- `ORDERS_DATABASE_URL` (по умолчанию `postgresql+psycopg2://postgres:postgres@localhost:5432/orders_db`)

3. Применить SQL-скрипты из директории `sql` к соответствующим БД.

4. Запустить сервисы в двух терминалах:

```bash
uvicorn products_service.app.main:app --reload --port 8001
uvicorn orders_service.app.main:app --reload --port 8002
```

## API

### Products Service (порт 8001)
- `GET /products`
- `GET /products/{product_id}`
- `POST /products`
- `PUT /products/{product_id}`
- `DELETE /products/{product_id}`

### Orders Service (порт 8002)
- `POST /orders`
- `GET /orders`
- `GET /orders/{order_id}`
- `PUT /orders/{order_id}/status`

## Запуск в Docker

```bash
docker compose up --build -d
```

Сервисы будут доступны:

- Products API: `http://localhost:8001`
- Orders API: `http://localhost:8002`

Остановить:

```bash
docker compose down
```

Остановить и удалить volumes БД:

```bash
docker compose down -v
```
# web-develop
