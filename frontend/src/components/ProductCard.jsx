import { Link, useNavigate } from 'react-router-dom'
import { useProductCartQty, QTY_MAX } from '../hooks/useProductCartQty'
import './ProductCard.css'

export function ProductCard({ product }) {
  const navigate = useNavigate()
  const { qty, inCart, qtyBusy, addToCart, increment, decrement } =
    useProductCartQty(product.id)

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__top">
        <div
          className="product-card__image"
          style={{
            backgroundColor: `hsl(${(Number(product.id) * 47) % 360} 55% 88%)`,
            backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : undefined,
            backgroundSize: product.imageUrl ? 'cover' : undefined,
            backgroundPosition: product.imageUrl ? 'center' : undefined,
          }}
        >
          <span className="product-card__image-label">товар</span>
        </div>
        <h3 className="product-card__name">{product.name}</h3>
      </Link>
      <div className="product-card__buy">
        <p className="product-card__price">
          {product.price.toLocaleString('ru-RU')} ₽
        </p>
        <div className="product-card__actions">
          <div
            className="product-card__qty"
            role="group"
            aria-label={`Количество: ${product.name}`}
          >
            <button
              type="button"
              className="product-card__qty-btn"
              aria-label="Меньше"
              disabled={qtyBusy || (!inCart && qty <= 1)}
              onClick={decrement}
            >
              −
            </button>
            <span className="product-card__qty-value" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              className="product-card__qty-btn"
              aria-label="Больше"
              disabled={qtyBusy || qty >= QTY_MAX}
              onClick={increment}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className={
              inCart
                ? 'product-card__cart-btn product-card__cart-btn--secondary'
                : 'product-card__cart-btn'
            }
            disabled={qtyBusy}
            aria-label={
              inCart ? 'Перейти в корзину' : `В корзину, ${qty} шт.`
            }
            onClick={() => {
              if (inCart) {
                navigate('/cart')
                return
              }
              addToCart(product, Math.max(1, qty))
            }}
          >
            {inCart ? 'Перейти в корзину' : 'В корзину'}
          </button>
        </div>
      </div>
    </article>
  )
}
