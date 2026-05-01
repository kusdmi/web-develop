import { Link } from 'react-router-dom'
import './ProductCard.css'

export function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__link">
        <div
          className="product-card__image"
          style={{ backgroundColor: product.imageColor }}
        >
          <span className="product-card__image-label">товар</span>
        </div>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">
          {product.price.toLocaleString('ru-RU')} ₽
        </p>
      </Link>
    </article>
  )
}
