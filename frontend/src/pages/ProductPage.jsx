import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../data/mockProducts'
import { CATEGORIES } from '../data/mockProducts'
import { ShopHeader } from '../components/ShopHeader'
import { useCart } from '../context/useCart'
import './ProductPage.css'

export function ProductPage() {
  const { id } = useParams()
  const product = getProductById(id)
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  if (!product) {
    return (
      <div className="product-page product-page--missing">
        <p>Товар не найден</p>
        <Link to="/catalog">В каталог</Link>
      </div>
    )
  }

  const goSearch = () => {
    const q = searchQuery.trim()
    navigate(q ? `/catalog?search=${encodeURIComponent(q)}` : '/catalog')
  }

  return (
    <div className="product-page">
      <ShopHeader
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={goSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={CATEGORIES}
      />
      <main className="product-page__main">
        <div
          className="product-page__image"
          style={{ backgroundColor: product.imageColor }}
        >
          <span className="product-page__image-label">товар</span>
        </div>
        <div className="product-page__info">
          <h1 className="product-page__title">{product.name}</h1>
          <div className="product-page__bars" aria-hidden>
            <span className="product-page__bar product-page__bar--long" />
            <span className="product-page__bar product-page__bar--medium" />
            <span className="product-page__bar product-page__bar--short" />
            <span className="product-page__bar product-page__bar--long" />
            <span className="product-page__bar product-page__bar--medium" />
          </div>
          <p className="product-page__description">{product.description}</p>
          <p className="product-page__price">
            {product.price.toLocaleString('ru-RU')} ₽
          </p>
          <button
            type="button"
            className="product-page__cart-btn"
            onClick={() => addToCart(product, 1)}
          >
            В корзину
          </button>
        </div>
      </main>
    </div>
  )
}
