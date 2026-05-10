import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearCart,
  selectCartEnrichedLines,
  selectCartTotalPrice,
} from '../store/cartSlice'
import {
  createOrder,
  selectCreateOrderError,
  selectCreateOrderStatus,
} from '../store/ordersSlice'
import './CheckoutPage.css'

/** Только цифры, длина 8 — показывается на странице и уходит на подтверждение */
function generateNumericOrderId() {
  let s = ''
  for (let i = 0; i < 8; i += 1) {
    s += Math.floor(Math.random() * 10).toString()
  }
  return s
}

/** Нормализация к виду 7 + 10 цифр (без плюса) или null */
function normalizeRuPhoneDigits(raw) {
  const d = String(raw).replace(/\D/g, '')
  if (d.length === 11) {
    if (d[0] === '8') return `7${d.slice(1)}`
    if (d[0] === '7') return d
    return null
  }
  if (d.length === 10) return `7${d}`
  return null
}

/**
 * Российский номер: после нормализации 11 цифр, код страны 7,
 * первая цифра национального номера — 3, 4, 8 или 9 (гео, моб., 8xx).
 */
function isValidRuPhone(raw) {
  const n = normalizeRuPhoneDigits(raw)
  if (!n || n.length !== 11 || n[0] !== '7') return false
  return /^7[3489]\d{9}$/.test(n)
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector(selectCartEnrichedLines)
  const totalPrice = useSelector(selectCartTotalPrice)
  const createStatus = useSelector(selectCreateOrderStatus)
  const createError = useSelector(selectCreateOrderError)
  const [orderNumber] = useState(generateNumericOrderId)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !address.trim()) {
      return
    }
    if (!isValidRuPhone(phone)) {
      setPhoneError(
        'Укажите номер в формате РФ: +7, 8 или 10 цифр без кода страны (например +7 916 123-45-67).',
      )
      return
    }
    setPhoneError('')

    const payload = {
      customer_name: name.trim(),
      phone: phone.trim(),
      email: email.trim() ? email.trim() : null,
      address: address.trim(),
      items: items.map((l) => ({
        product_id: l.productId,
        quantity: l.quantity,
      })),
    }

    try {
      const created = await dispatch(createOrder(payload)).unwrap()
      dispatch(clearCart())
      navigate('/confirmation', {
        state: { orderId: String(created?.id ?? orderNumber) },
      })
    } catch {
      // ошибка уже в store
    }
  }

  return (
    <div className="checkout-page">
      <header className="checkout-page__top">
        <Link to="/catalog" className="checkout-page__logo" aria-label="На главную">
          Лого
        </Link>
        <Link to="/cart" className="checkout-page__back-cart">
          Вернуться в корзину
        </Link>
      </header>
      <h1 className="checkout-page__title">Заказ</h1>

      {items.length === 0 ? (
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
      ) : (
        <form className="checkout-page__box" onSubmit={handleSubmit}>
          <p className="checkout-page__order-id">
            Номер заказа: <strong>{orderNumber}</strong>
          </p>

          <h2 className="checkout-page__subheading">Состав заказа</h2>
          <ul className="checkout-page__items">
            {items.map(({ product, productId, quantity }) => {
              const price = Number(product?.price) || 0
              const lineTotal = price * quantity
              return (
                <li key={productId} className="checkout-page__item">
                  <span className="checkout-page__item-name">
                    {product?.name ?? `Товар #${productId}`}
                  </span>
                  <span className="checkout-page__item-detail">
                    {quantity} шт. ×{' '}
                    {price.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="checkout-page__item-sum">
                    {lineTotal.toLocaleString('ru-RU')} ₽
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="checkout-page__total-row">
            <span>Итого</span>
            <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>

          <h2 className="checkout-page__heading">Данные получателя</h2>
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
              id="checkout-phone"
              className={`checkout-page__input${phoneError ? ' checkout-page__input--invalid' : ''}`}
              type="tel"
              placeholder="+7 (916) 123-45-67"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                if (phoneError) setPhoneError('')
              }}
              required
              autoComplete="tel"
              aria-invalid={phoneError ? true : undefined}
              aria-describedby={phoneError ? 'checkout-phone-error' : undefined}
            />
          </label>
          <label className="checkout-page__field">
            <span className="visually-hidden">Email</span>
            <input
              className="checkout-page__input"
              type="email"
              placeholder="Email (необязательно)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          {phoneError ? (
            <p id="checkout-phone-error" className="checkout-page__field-error" role="alert">
              {phoneError}
            </p>
          ) : null}
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
          <p className="checkout-page__delivery-note">
            Оплата при получении. Доставка по городу 1–2 рабочих дня. Точное
            время согласуем по телефону.
          </p>
          {createStatus === 'failed' && createError ? (
            <p className="checkout-page__field-error" role="alert">
              {createError}
            </p>
          ) : null}
          <button
            type="submit"
            className="checkout-page__submit"
            disabled={createStatus === 'loading'}
          >
            {createStatus === 'loading' ? 'Отправляем…' : 'Оформить заказ'}
          </button>
        </form>
      )}
    </div>
  )
}
