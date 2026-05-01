import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import './CartPage.css'

export function CartPage() {
  const { items, totalPrice, setLineQuantity } = useCart()

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Корзина</h1>
      <div className="cart-page__box">
        <div className="cart-page__box-head">
          <span className="cart-page__box-head-pill" aria-hidden />
        </div>
        <ul className="cart-page__list">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="cart-page__item">
              <div
                className="cart-page__thumb"
                style={{ backgroundColor: product.imageColor }}
              />
              <div className="cart-page__meta">
                <p className="cart-page__name">{product.name}</p>
                <p className="cart-page__desc">{product.description}</p>
              </div>
              <div className="cart-page__qty">
                <label className="visually-hidden" htmlFor={`qty-${product.id}`}>
                  Количество {product.name}
                </label>
                <input
                  id={`qty-${product.id}`}
                  type="number"
                  min={1}
                  className="cart-page__qty-input"
                  value={quantity}
                  onChange={(e) =>
                    setLineQuantity(product.id, Number(e.target.value) || 1)
                  }
                />
                <span className="cart-page__qty-suffix">шт</span>
              </div>
              <div className="cart-page__line-price">
                {(product.price * quantity).toLocaleString('ru-RU')} ₽
              </div>
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
            <Link to="/catalog" className="cart-page__checkout cart-page__checkout--muted">
              В каталог
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
