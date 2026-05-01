import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { QTY_MAX } from '../hooks/useProductCartQty'
import './CartPage.css'

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}

export function CartPage() {
  const { items, totalPrice, setLineQuantity, removeLine } = useCart()

  return (
    <div className="cart-page">
      <header className="cart-page__top">
        <Link to="/catalog" className="cart-page__logo" aria-label="На главную">
          Лого
        </Link>
        <Link to="/catalog" className="cart-page__back-shop">
          Вернуться к покупкам
        </Link>
      </header>
      <h1 className="cart-page__title">Корзина</h1>
      <div className="cart-page__box">
        <ul className="cart-page__list">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="cart-page__item">
              <Link
                to={`/product/${product.id}`}
                className="cart-page__thumb-link"
                aria-label={`Открыть ${product.name}`}
              >
                <div
                  className="cart-page__thumb"
                  style={{ backgroundColor: product.imageColor }}
                />
              </Link>
              <div className="cart-page__meta">
                <Link to={`/product/${product.id}`} className="cart-page__name-link">
                  <p className="cart-page__name">{product.name}</p>
                </Link>
                <p className="cart-page__desc">{product.description}</p>
              </div>
              <div className="cart-page__qty">
                <label className="visually-hidden" htmlFor={`qty-${product.id}`}>
                  Количество {product.name}
                </label>
                <input
                  id={`qty-${product.id}`}
                  type="number"
                  min={0}
                  max={QTY_MAX}
                  className="cart-page__qty-input"
                  value={quantity}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10)
                    setLineQuantity(
                      product.id,
                      Number.isNaN(n)
                        ? 0
                        : Math.min(QTY_MAX, Math.max(0, n)),
                    )
                  }}
                />
                <span className="cart-page__qty-suffix">шт</span>
              </div>
              <div className="cart-page__line-price">
                {(product.price * quantity).toLocaleString('ru-RU')} ₽
              </div>
              <button
                type="button"
                className="cart-page__remove"
                onClick={() => removeLine(product.id)}
                aria-label={`Удалить «${product.name}» из корзины`}
              >
                <TrashIcon />
                <span className="cart-page__remove-text">Удалить</span>
              </button>
            </li>
          ))}
        </ul>
        {items.length === 0 && (
          <p className="cart-page__empty">Корзина пуста</p>
        )}
        <div className="cart-page__summary">
          <div className="cart-page__summary-row">
            <span>Сумма</span>
            <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="cart-page__summary-row cart-page__summary-row--total">
            <span>Итого</span>
            <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
        <div className="cart-page__box-foot">
          {items.length > 0 ? (
            <Link to="/checkout" className="cart-page__checkout">
              Оформить заказ
            </Link>
          ) : (
            <Link
              to="/catalog"
              className="cart-page__checkout cart-page__checkout--muted"
            >
              В каталог
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
