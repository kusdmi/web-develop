import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectLastCreatedOrder } from '../store/ordersSlice'
import { orderStatusLabel } from '../utils/orderStatus'
import './ConfirmationPage.css'

export function ConfirmationPage() {
  const location = useLocation()
  const last = useSelector(selectLastCreatedOrder)
  const stateOrder = location.state?.order ?? null
  const orderId =
    location.state?.orderId ?? (last?.id ? String(last.id) : null)

  const order =
    stateOrder && String(stateOrder.id) === String(orderId)
      ? stateOrder
      : last && String(last.id) === String(orderId)
        ? last
        : null

  return (
    <div className="confirmation-page">
      <h1 className="confirmation-page__title">Подтверждение</h1>
      <div className="confirmation-page__box">
        <div className="confirmation-page__icon" aria-hidden>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <p className="confirmation-page__msg">Спасибо, ваш заказ оформлен</p>
        <p className="confirmation-page__order">
          Номер заказа: <span>{orderId ?? '—'}</span>
        </p>
        {order ? <p>Статус: {orderStatusLabel(order.status)}</p> : null}
        <Link to="/catalog" className="confirmation-page__home">
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}
