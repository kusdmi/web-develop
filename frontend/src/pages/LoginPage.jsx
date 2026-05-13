import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAdminAuth } from '../admin/useAdminAuth'
import './AuthPage.css'

export function LoginPage() {
  const { isAuthenticated, login } = useAdminAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin/products" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return
    setError('')
    setLoading(true)
    try {
      await login(username.trim(), password)
    } catch (err) {
      setError(err?.message || 'Неверный логин или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Link to="/catalog" className="auth-page__back">
        ← В каталог
      </Link>
      <h1 className="auth-page__title">Авторизация</h1>
      <div className="auth-page__card">
        <h2 className="auth-page__card-title">Вход</h2>
        <p className="auth-page__card-sub">Вход для администраторов магазина</p>
        <form className="auth-page__form" onSubmit={handleSubmit}>
          <label className="auth-page__field">
            <span className="auth-page__label">Логин</span>
            <input
              className="auth-page__input"
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Логин"
              required
            />
          </label>
          <label className="auth-page__field">
            <span className="auth-page__label">Пароль</span>
            <input
              className="auth-page__input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              required
            />
          </label>
          {error ? (
            <p className="auth-page__error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="auth-page__submit" disabled={loading}>
            {loading ? 'Вход…' : 'Войти'}
          </button>
        </form>
        <p className="auth-page__switch">
          Нет аккаунта?{' '}
          <Link to="/register" className="auth-page__link">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
