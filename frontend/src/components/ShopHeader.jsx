import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { useCart } from '../context/useCart'
import './ShopHeader.css'

const MQ_DESKTOP = '(min-width: 768px)'

function subscribeDesktopMq(cb) {
  const mq = window.matchMedia(MQ_DESKTOP)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getDesktopSnapshot() {
  return window.matchMedia(MQ_DESKTOP).matches
}

function getDesktopServerSnapshot() {
  return false
}

const navClass = ({ isActive }) =>
  `shop-header__nav-link${isActive ? ' shop-header__nav-link--active' : ''}`

function CartLink({ className = '', onNavigate }) {
  const { totalItems, totalPrice } = useCart()
  return (
    <Link
      to="/cart"
      className={`shop-header__cart ${className}`.trim()}
      onClick={onNavigate}
    >
      <span className="shop-header__cart-icon" aria-hidden>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </span>
      <span className="shop-header__cart-text">
        <span>Товаров: {totalItems}</span>
        <span>
          {totalPrice.toLocaleString('ru-RU')} ₽ — сумма заказа
        </span>
      </span>
    </Link>
  )
}

export function ShopHeader({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  compact = false,
}) {
  const isDesktop = useSyncExternalStore(
    subscribeDesktopMq,
    getDesktopSnapshot,
    getDesktopServerSnapshot,
  )
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!mobileNavOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileNavOpen])

  useEffect(() => {
    if (!mobileNavOpen || isDesktop) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileNavOpen, isDesktop])

  const closeMobile = () => setMobileNavOpen(false)

  const handleSearch = (e) => {
    e.preventDefault()
    onSearchSubmit?.()
  }

  const handleMobileSearch = (e) => {
    handleSearch(e)
    closeMobile()
  }

  const mobileSearchForm =
    !compact ? (
      <form
        className="shop-header__search shop-header__search--mobile-menu"
        onSubmit={handleMobileSearch}
      >
        <label className="visually-hidden" htmlFor="catalog-category-menu">
          Категория
        </label>
        <select
          id="catalog-category-menu"
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
          id="catalog-search-menu"
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
    ) : null

  const navItems = (mobile = false) => (
    <nav
      className={
        mobile
          ? 'shop-header__nav shop-header__nav--mobile'
          : 'shop-header__nav'
      }
      aria-label="Основное меню"
    >
      <NavLink
        to="/catalog"
        className={navClass}
        end
        onClick={mobile ? closeMobile : undefined}
      >
        Главная
      </NavLink>
      <a
        href="#delivery"
        className="shop-header__nav-link"
        onClick={mobile ? closeMobile : undefined}
      >
        Доставка
      </a>
      <a
        href="#payment"
        className="shop-header__nav-link"
        onClick={mobile ? closeMobile : undefined}
      >
        Оплата
      </a>
      <a
        href="#contacts"
        className="shop-header__nav-link"
        onClick={mobile ? closeMobile : undefined}
      >
        Контакты
      </a>
    </nav>
  )

  const loginLink = (mobile = false) => (
    <Link
      to="/login"
      className={
        mobile
          ? 'shop-header__login shop-header__login--mobile-menu'
          : 'shop-header__login'
      }
      onClick={mobile ? closeMobile : undefined}
    >
      <span className="shop-header__login-icon" aria-hidden>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </span>
      <span className="shop-header__login-text">Войти</span>
    </Link>
  )

  return (
    <header className={`shop-header${compact ? ' shop-header--compact' : ''}`}>
      <div
        className={`shop-header__row shop-header__row--top${isDesktop ? '' : ' shop-header__row--top-mobile'}`}
      >
        <Link to="/catalog" className="shop-header__logo" aria-label="На главную">
          Лого
        </Link>

        {isDesktop ? (
          <>
            {navItems(false)}
            <div className="shop-header__trailing">
              {loginLink(false)}
              <CartLink onNavigate={undefined} />
            </div>
          </>
        ) : (
          <div className="shop-header__mobile-bar">
            <button
              type="button"
              className={`shop-header__burger${mobileNavOpen ? ' shop-header__burger--open' : ''}`}
              aria-expanded={mobileNavOpen}
              aria-controls="shop-header-mobile-menu"
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              <span className="visually-hidden">
                {mobileNavOpen ? 'Закрыть меню' : 'Открыть меню'}
              </span>
              <span className="shop-header__burger-lines" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </button>
            <CartLink
              className="shop-header__cart--in-header"
              onNavigate={undefined}
            />
          </div>
        )}
      </div>

      {!isDesktop && mobileNavOpen ? (
        <div
          id="shop-header-mobile-menu"
          className="shop-header__mobile-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
        >
          <div className="shop-header__mobile-panel-head">
            <span className="shop-header__mobile-panel-title">Меню</span>
            <button
              type="button"
              className="shop-header__mobile-close"
              onClick={closeMobile}
            >
              Закрыть
            </button>
          </div>
          {mobileSearchForm}
          {navItems(true)}
          {loginLink(true)}
        </div>
      ) : null}

      {isDesktop && !compact ? (
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
      ) : null}
    </header>
  )
}
