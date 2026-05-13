# Витрина и админка (React + Vite + Redux)

Клиентское приложение демо-магазина (лампочки): **React**, **Vite**, **React Router**, **Redux Toolkit**. Данные каталога и заказов приходят с **бэкенда по HTTP** (в режиме разработки — через **прокси** в `vite.config.js`: `/api/products` → products-service, `/api/orders` → orders-service, `/api/static` → статика картинок).

Корзина хранится в **`localStorage`** (см. `src/store/storage.js`, слайс `cartSlice`), чтобы позиции не пропадали после перезагрузки страницы.

## Что в приложении

- **Каталог** (`/catalog`): сетка товаров, слайдер, боковая панель фильтров (цена, цоколь, мощность, бренд, форма — значения выводятся из данных товаров), поиск и категория в шапке; на мобилке поиск в полноэкранном меню.
- **Карточка товара** (`/product/:id`): изображение или заглушка, категория, описание, цена, количество, в корзину.
- **Корзина** (`/cart`), **оформление** (`/checkout`), **подтверждение** (`/confirmation`): отправка заказа на `POST /api/orders`, проверка телефона РФ на checkout.
- **Вход** (`/login`): запрос JWT у products-service; после входа в шапке доступна ссылка в админку.
- **Регистрация** (`/register`): форма без отдельного backend (переход на `/login`).
- **Админка** (`/admin/...`, только с валидным JWT): товары (CRUD, загрузка изображения), заказы (список, смена статуса).

## Запуск

Нужны запущенные **products-service** и **orders-service** (например через `docker compose` из корня репозитория — см. **`../README.md`**).

```bash
npm install
npm run dev
```

В браузере откройте адрес из вывода Vite (обычно `http://localhost:5173`).

Просмотр production-сборки с тем же прокси:

```bash
npm run build
npm run preview
```

## Скрипты

| Команда | Назначение |
|--------|------------|
| `npm run dev` | режим разработки с HMR |
| `npm run build` | сборка в `dist/` |
| `npm run preview` | просмотр сборки (прокси как в `dev`) |
| `npm run lint` | ESLint |

## Маршруты

| Путь | Страница |
|------|----------|
| `/` | редирект на `/catalog` |
| `/catalog` | каталог |
| `/catalog?search=…` | каталог с поиском из строки запроса |
| `/product/:id` | товар |
| `/cart` | корзина |
| `/checkout` | оформление заказа |
| `/confirmation` | подтверждение (после успешного checkout) |
| `/login`, `/register` | вход и регистрация |
| `/admin`, `/admin/products`, `/admin/orders` | админка (JWT) |
| `*` | редирект на `/catalog` |

## Структура (основное)

- `src/pages/` — страницы витрины и авторизации
- `src/components/` — шапка, подвал, слайдер, фильтры, карточка товара
- `src/store/` — Redux: `store.js`, слайсы `products`, `cart`, `orders`
- `src/api/fetchJson.js` — обёртка над `fetch` для публичных запросов
- `src/admin/` — админка, JWT (`adminToken.js`, `adminApi.js`, `AdminAuthProvider`, маршруты)
- `src/hooks/` — `useProductCartQty`, `useMatchMedia`
- `src/data/mockProducts.js` — устаревший мок-каталог (в рантайме не используется; каталог с API)
