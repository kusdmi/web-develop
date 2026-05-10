import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCartEnrichedLines,
  selectCartTotalPrice,
  setLineQuantity,
  removeLine,
  QTY_MAX,
} from '../store/cartSlice'
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
  const dispatch = useDispatch()
  const items = useSelector(selectCartEnrichedLines)
  const totalPrice = useSelector(selectCartTotalPrice)

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
          {items.map(({ product, productId, quantity }) => (
            <li key={productId} className="cart-page__item">
              <Link
                to={`/product/${productId}`}
                className="cart-page__thumb-link"
                aria-label={`Открыть ${product?.name ?? 'товар'}`}
              >
                <div
                  className="cart-page__thumb"
                  style={{
                    backgroundColor: `hsl(${(productId * 47) % 360} 55% 88%)`,
                    backgroundImage: product?.imageUrl ? `url(${product.imageUrl})` : undefined,
                    backgroundSize: product?.imageUrl ? 'cover' : undefined,
                    backgroundPosition: product?.imageUrl ? 'center' : undefined,
                  }}
                />
              </Link>
              <div className="cart-page__meta">
                <Link to={`/product/${productId}`} className="cart-page__name-link">
                  <p className="cart-page__name">
                    {product?.name ?? `Товар #${productId}`}
                  </p>
                </Link>
                <p className="cart-page__desc">
                  {product?.description || 'Описание отсутствует.'}
                </p>
              </div>
              <div
                className="cart-page__qty"
                role="group"
                aria-label={`Количество: ${product?.name ?? `товар #${productId}`}`}
              >
                <label className="visually-hidden" htmlFor={`qty-${productId}`}>
                  Количество {product?.name ?? `товар #${productId}`}
                </label>
                <div className="cart-page__qty-stepper">
                  <button
                    type="button"
                    className="cart-page__qty-btn cart-page__qty-btn--minus"
                    aria-label="Уменьшить количество"
                    onClick={() =>
                      dispatch(setLineQuantity({ productId, quantity: quantity - 1 }))
                    }
                  >
                    <span className="cart-page__qty-char" aria-hidden>
                      −
                    </span>
                  </button>
                  <input
                    id={`qty-${productId}`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={QTY_MAX}
                    className="cart-page__qty-input"
                    value={quantity}
                    onChange={(e) => {
                      const n = parseInt(e.target.value, 10)
                      dispatch(
                        setLineQuantity({
                          productId,
                          quantity: Number.isNaN(n) ? 0 : Math.min(QTY_MAX, Math.max(0, n)),
                        }),
                      )
                    }}
                  />
                  <button
                    type="button"
                    className="cart-page__qty-btn cart-page__qty-btn--plus"
                    aria-label="Увеличить количество"
                    disabled={quantity >= QTY_MAX}
                    onClick={() =>
                      dispatch(setLineQuantity({ productId, quantity: quantity + 1 }))
                    }
                  >
                    <span className="cart-page__qty-char" aria-hidden>
                      +
                    </span>
                  </button>
                </div>
                <span className="cart-page__qty-suffix">шт</span>
              </div>
              <div className="cart-page__line-price">
                {((Number(product?.price) || 0) * quantity).toLocaleString('ru-RU')} ₽
              </div>
              <button
                type="button"
                className="cart-page__remove"
                onClick={() => dispatch(removeLine({ productId }))}
                aria-label={`Удалить «${product?.name ?? `товар #${productId}` }» из корзины`}
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
