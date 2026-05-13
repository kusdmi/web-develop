# Интернет-магазин: микросервисы и фронтенд

В репозитории:

- **Backend** — два микросервиса на **FastAPI** (`products_service`, `orders_service`), PostgreSQL, сиды в `sql/`.
- **Frontend** — витрина и админка на **React + Vite + Redux** (папка `frontend`).

## Архитектура и доступ

| Зона | JWT |
|------|-----|
| Каталог товаров, карточка товара | не требуется (`GET /products`, `GET /products/{id}`) |
| Оформление заказа с витрины | не требуется (`POST /orders`) |
| Админка: CRUD товаров, загрузка изображений | требуется (заголовок `Authorization: Bearer …` к products-service) |
| Админка: список заказов, заказ по id, смена статуса | требуется (к orders-service) |

Вход администратора на фронте: **`/login`**. После успешного ответа `POST /products/admin/login` токен хранится в **`sessionStorage`** и подставляется в защищённые запросы.

Учётные данные по умолчанию в **`docker-compose.yml`**: `ADMIN_USERNAME` / `ADMIN_PASSWORD` (и одинаковый `ADMIN_JWT_SECRET` у обоих сервисов для проверки токена).

## Микросервисы

### `products_service` (порт **8001**)

- `GET /products` — список товаров (публично).
- `GET /products/{product_id}` — товар (публично).
- `POST /products/admin/login` — выдача JWT.
- `POST /products/admin/upload-image` — загрузка файла (**JWT**).
- `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}` — изменение каталога (**JWT**).
- Статика загруженных картинок: `GET /static/...` (на фронте через прокси: `/api/static/...`).

### `orders_service` (порт **8002**)

- `POST /orders` — создать заказ (**без JWT**; цены позиций подтягиваются из products-service).
- `GET /orders`, `GET /orders/{order_id}`, `PUT /orders/{order_id}/status` — только с **JWT**.

## Запуск в Docker (рекомендуется)

```bash
docker compose up --build -d
```

Сервисы:

- Products API: `http://localhost:8001`
- Orders API: `http://localhost:8002`
- PostgreSQL products (на хосте): порт **5433**
- PostgreSQL orders (на хосте): порт **5434**

Остановка:

```bash
docker compose down
```

С удалением томов БД (полный сброс данных):

```bash
docker compose down -v
```

## Локальный запуск без Docker (разработка)

1. Поднять PostgreSQL и применить скрипты из `sql/` к базам `products_db` и `orders_db`.

2. Установить зависимости Python:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

3. Задать переменные окружения (как минимум строки подключения и админские настройки), по аналогии с `docker-compose.yml`:

- `PRODUCTS_DATABASE_URL`, `ORDERS_DATABASE_URL`
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET` — **одинаковый секрет** на обоих сервисах
- `PRODUCTS_SERVICE_URL` — для orders-service (при локальном запуске обычно `http://127.0.0.1:8001`)
- для products-service при загрузке файлов: `PRODUCTS_UPLOAD_DIR`

4. Запустить API в двух терминалах:

```bash
uvicorn products_service.app.main:app --reload --port 8001
uvicorn orders_service.app.main:app --reload --port 8002
```

5. Фронтенд (прокси к API описан в `frontend/vite.config.js`):

```bash
cd frontend
npm install
npm run dev
```

Откройте в браузере адрес из вывода Vite (часто `http://localhost:5173`). Запросы идут на `/api/products`, `/api/orders`, `/api/static`.

## Фронтенд

Подробнее о страницах, маршрутах и структуре — в **`frontend/README.md`**.

Сборка и линт:

```bash
cd frontend
npm run build
npm run lint
```
