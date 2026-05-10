import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchOrderById,
  selectLastCreatedOrder,
  selectOrderById,
  selectOrderByIdError,
  selectOrderByIdStatus,
} from '../store/ordersSlice'
import './ConfirmationPage.css'

export function ConfirmationPage() {
  const dispatch = useDispatch()
  const location = useLocation()
  const last = useSelector(selectLastCreatedOrder)
  const orderId = location.state?.orderId ?? (last?.id ? String(last.id) : null)
  const order = useSelector((s) => selectOrderById(s, orderId))
  const orderStatus = useSelector((s) => selectOrderByIdStatus(s, orderId))
  const orderError = useSelector((s) => selectOrderByIdError(s, orderId))

  useEffect(() => {
    if (!orderId) return
    if (orderStatus === 'loading' || orderStatus === 'succeeded') return
    dispatch(fetchOrderById(orderId))
  }, [dispatch, orderId, orderStatus])

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
        {orderStatus === 'loading' ? <p>Загружаем данные заказа…</p> : null}
        {orderStatus === 'failed' ? <p>{orderError || 'Не удалось получить заказ'}</p> : null}
        {order ? <p>Статус: {order.status}</p> : null}
        <Link to="/catalog" className="confirmation-page__home">
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}
