import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAdminAuth } from './useAdminAuth'
import './AdminPages.css'

const linkClass = ({ isActive }) =>
  `admin-layout__nav-link${isActive ? ' admin-layout__nav-link--active' : ''}`

export function AdminLayout() {
  const { logout } = useAdminAuth()

  return (
    <div className="admin-layout">
      <header className="admin-layout__header">
        <Link to="/catalog" className="admin-layout__to-shop">
          ← В каталог
        </Link>
        <span className="admin-layout__brand">Администрирование</span>
        <nav className="admin-layout__nav" aria-label="Разделы админки">
          <NavLink to="/admin/products" className={linkClass}>
            Товары
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            Заказы
          </NavLink>
        </nav>
        <button type="button" className="admin-layout__logout" onClick={logout}>
          Выйти
        </button>
      </header>
      <main className="admin-layout__main">
        <Outlet />
      </main>
    </div>
  )
}
