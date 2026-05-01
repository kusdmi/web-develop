import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'
import './CheckoutPage.css'

function randomOrderId() {
  return String(Math.floor(10000 + Math.random() * 90000))
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !address.trim()) {
      return
    }
    const orderId = randomOrderId()
    clearCart()
    navigate('/confirmation', { state: { orderId } })
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <h1 className="checkout-page__title">Заказ</h1>
        <div className="checkout-page__box checkout-page__box--notice">
          <p>Корзина пуста. Добавьте товары перед оформлением.</p>
          <button
            type="button"
            className="checkout-page__submit"
            onClick={() => navigate('/catalog')}
          >
            Перейти в каталог
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Заказ</h1>
      <form className="checkout-page__box" onSubmit={handleSubmit}>
        <div className="checkout-page__section-bar" aria-hidden />
        <label className="checkout-page__field">
          <span className="visually-hidden">Имя</span>
          <input
            className="checkout-page__input"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </label>
        <label className="checkout-page__field">
          <span className="visually-hidden">Телефон</span>
          <input
            className="checkout-page__input"
            type="tel"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
          />
        </label>
        <label className="checkout-page__field">
          <span className="visually-hidden">Адрес</span>
          <textarea
            className="checkout-page__textarea"
            placeholder="Адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={4}
            autoComplete="street-address"
          />
        </label>
        <div className="checkout-page__mock-summary" aria-hidden>
          <span className="checkout-page__mock-line checkout-page__mock-line--long" />
          <span className="checkout-page__mock-line checkout-page__mock-line--short" />
        </div>
        <div className="checkout-page__order-lines">
          <p className="checkout-page__order-note">
            Товаров: {items.reduce((n, l) => n + l.quantity, 0)} — на сумму{' '}
            {totalPrice.toLocaleString('ru-RU')} ₽
          </p>
        </div>
        <button type="submit" className="checkout-page__submit">
          Оформить заказ
        </button>
      </form>
    </div>
  )
}
