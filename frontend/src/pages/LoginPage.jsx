import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AuthPage.css'

export function LoginPage() {
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!login.trim() || !password.trim()) return
    // Без backend: имитация успешного входа
    navigate('/catalog', { replace: true })
  }

  return (
    <div className="auth-page">
      <Link to="/catalog" className="auth-page__back">
        ← В каталог
      </Link>
      <h1 className="auth-page__title">Авторизация</h1>
      <div className="auth-page__card">
        <h2 className="auth-page__card-title">Вход</h2>
        <form className="auth-page__form" onSubmit={handleSubmit}>
          <label className="auth-page__field">
            <span className="auth-page__label">Логин или e-mail</span>
            <input
              className="auth-page__input"
              type="text"
              name="login"
              autoComplete="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
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
          <button type="submit" className="auth-page__submit">
            Войти
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
