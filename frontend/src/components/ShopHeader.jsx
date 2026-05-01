import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/useCart'
import './ShopHeader.css'

const navClass = ({ isActive }) =>
  `shop-header__nav-link${isActive ? ' shop-header__nav-link--active' : ''}`

export function ShopHeader({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}) {
  const { totalItems, totalPrice } = useCart()

  const handleSearch = (e) => {
    e.preventDefault()
    onSearchSubmit?.()
  }

  return (
    <header className="shop-header">
      <div className="shop-header__row shop-header__row--top">
        <Link to="/catalog" className="shop-header__logo" aria-label="На главную">
          Лого
        </Link>
        <nav className="shop-header__nav" aria-label="Основное меню">
          <NavLink to="/catalog" className={navClass} end>
            Главная
          </NavLink>
          <a href="#delivery" className="shop-header__nav-link">
            Доставка
          </a>
          <a href="#payment" className="shop-header__nav-link">
            Оплата
          </a>
          <a href="#contacts" className="shop-header__nav-link">
            Контакты
          </a>
        </nav>
        <Link to="/cart" className="shop-header__cart">
          <span className="shop-header__cart-icon" aria-hidden />
          <span className="shop-header__cart-text">
            <span>Товаров: {totalItems}</span>
            <span>
              {totalPrice.toLocaleString('ru-RU')} ₽ — сумма заказа
            </span>
          </span>
        </Link>
      </div>
      <form className="shop-header__row shop-header__search" onSubmit={handleSearch}>
        <label className="visually-hidden" htmlFor="catalog-category">
          Категория
        </label>
        <select
          id="catalog-category"
          className="shop-header__select"
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c === 'Все' ? '' : c}>
              {c === 'Все' ? 'Категории' : c}
            </option>
          ))}
        </select>
        <input
          type="search"
          className="shop-header__input"
          placeholder="Поиск по каталогу"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          aria-label="Поиск"
        />
        <button type="submit" className="shop-header__search-btn">
          Поиск
        </button>
      </form>
    </header>
  )
}
