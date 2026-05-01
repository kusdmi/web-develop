# Интернет-магазин: микросервисы и фронтенд

В репозитории два направления:

- **Backend** — два микросервиса на FastAPI по ТЗ.
- **Frontend** — пользовательская витрина на React (папка `frontend`).

> Админ-панель и аутентификация на данном этапе не реализованы.

## Микросервисы (FastAPI)

- `products_service` — каталог и CRUD по товарам.
- `orders_service` — заказы и смена статуса.

### Быстрый запуск

1. Установить зависимости:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. При необходимости задать переменные окружения (есть значения по умолчанию):

- `PRODUCTS_DATABASE_URL` — по умолчанию `postgresql+psycopg2://postgres:postgres@localhost:5432/products_db`
- `ORDERS_DATABASE_URL` — по умолчанию `postgresql+psycopg2://postgres:postgres@localhost:5432/orders_db`

3. Применить SQL-скрипты из каталога `sql` к соответствующим базам.

4. Запустить сервисы в двух терминалах:

```bash
uvicorn products_service.app.main:app --reload --port 8001
uvicorn orders_service.app.main:app --reload --port 8002
```

### API

**Products (порт 8001)**

- `GET /products`
- `GET /products/{product_id}`
- `POST /products`
- `PUT /products/{product_id}`
- `DELETE /products/{product_id}`

**Orders (порт 8002)**

- `POST /orders`
- `GET /orders`
- `GET /orders/{order_id}`
- `PUT /orders/{order_id}/status`

## Фронтенд (React + Vite)

Витрина с маршрутизацией (React Router): каталог, карточка товара, корзина, оформление заказа, страница подтверждения. Данные пока **моковые**, без подключения к API.

```bash
cd frontend
npm install
npm run dev
```

Сборка и проверка линтером:

```bash
npm run build
npm run lint
```

## Запуск в Docker

```bash
docker compose up --build -d
```

После старта:

- Products API: `http://localhost:8001`
- Orders API: `http://localhost:8002`

Остановка:

```bash
docker compose down
```

Остановка с удалением томов БД:

```bash
docker compose down -v
```
