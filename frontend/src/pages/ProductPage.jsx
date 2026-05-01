import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../data/mockProducts'
import { ShopHeader } from '../components/ShopHeader'
import { Footer } from '../components/Footer'
import { useProductCartQty, QTY_MAX } from '../hooks/useProductCartQty'
import './ProductPage.css'

function ProductDetail({ product }) {
  const navigate = useNavigate()
  const { qty, inCart, qtyBusy, addToCart, increment, decrement } =
    useProductCartQty(product.id)

  return (
    <main className="product-page__main">
      <div
        className="product-page__image"
        style={{ backgroundColor: product.imageColor }}
      >
        <span className="product-page__image-label">товар</span>
      </div>
      <div className="product-page__info">
        <p className="product-page__category">{product.category}</p>
        <h1 className="product-page__title">{product.name}</h1>
        <p className="product-page__description">{product.description}</p>
        <p className="product-page__price">
          {product.price.toLocaleString('ru-RU')} ₽
        </p>
        <div className="product-page__cart-block">
          <div
            className="product-page__qty"
            role="group"
            aria-label="Количество"
          >
            <button
              type="button"
              className="product-page__qty-btn product-page__qty-btn--minus"
              aria-label="Уменьшить количество"
              disabled={qtyBusy || (!inCart && qty <= 1)}
              onClick={decrement}
            >
              <span className="product-page__qty-char" aria-hidden>
                −
              </span>
            </button>
            <span className="product-page__qty-value" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              className="product-page__qty-btn product-page__qty-btn--plus"
              aria-label="Увеличить количество"
              disabled={qtyBusy || qty >= QTY_MAX}
              onClick={increment}
            >
              <span className="product-page__qty-char" aria-hidden>
                +
              </span>
            </button>
          </div>
          <button
            type="button"
            className={
              inCart
                ? 'product-page__cart-btn product-page__cart-btn--secondary'
                : 'product-page__cart-btn'
            }
            disabled={qtyBusy}
            aria-label={
              inCart
                ? 'Перейти в корзину'
                : `Добавить в корзину, ${qty} шт.`
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
    </main>
  )
}

export function ProductPage() {
  const { id } = useParams()
  const product = getProductById(id)

  if (!product) {
    return (
      <div className="product-page">
        <div className="product-page--missing">
          <p>Товар не найден</p>
          <Link to="/catalog">В каталог</Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="product-page">
      <ShopHeader compact />
      <ProductDetail key={id} product={product} />
      <Footer />
    </div>
  )
}
