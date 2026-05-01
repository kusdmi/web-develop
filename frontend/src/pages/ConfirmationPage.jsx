import { Link, useLocation } from 'react-router-dom'
import './ConfirmationPage.css'

export function ConfirmationPage() {
  const location = useLocation()
  const orderId = location.state?.orderId ?? '12345'

  return (
    <div className="confirmation-page">
      <h1 className="confirmation-page__title">Подтверждение</h1>
      <div className="confirmation-page__box">
        <p className="confirmation-page__msg">Спасибо ваш заказ оформлен</p>
        <p className="confirmation-page__order">
          Номер вашего заказа {orderId}
        </p>
        <Link to="/catalog" className="confirmation-page__home">
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}
