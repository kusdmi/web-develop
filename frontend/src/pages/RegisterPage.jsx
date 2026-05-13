import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AuthPage.css'

export function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !login.trim() || !password.trim()) return
    if (password !== password2) {
      setError('Пароли не совпадают')
      return
    }
    navigate('/login', { replace: true })
  }

  return (
    <div className="auth-page">
      <Link to="/catalog" className="auth-page__back">
        ← В каталог
      </Link>
      <h1 className="auth-page__title">Регистрация</h1>
      <div className="auth-page__card">
        <h2 className="auth-page__card-title">Создать аккаунт</h2>
        <form className="auth-page__form" onSubmit={handleSubmit}>
          <label className="auth-page__field">
            <span className="auth-page__label">E-mail</span>
            <input
              className="auth-page__input"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mail@example.com"
              required
            />
          </label>
          <label className="auth-page__field">
            <span className="auth-page__label">Логин</span>
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              required
              minLength={6}
            />
          </label>
          <label className="auth-page__field">
            <span className="auth-page__label">Повторите пароль</span>
            <input
              className="auth-page__input"
              type="password"
              name="password2"
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Пароль ещё раз"
              required
              minLength={6}
            />
          </label>
          {error ? <p className="auth-page__error">{error}</p> : null}
          <button type="submit" className="auth-page__submit">
            Зарегистрироваться
          </button>
        </form>
        <p className="auth-page__switch">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="auth-page__link">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
