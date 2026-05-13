import { useCallback, useEffect, useState } from 'react'
import { fetchJson } from '../api/fetchJson'
import { fetchAdminJson } from './adminApi'
import { ORDER_STATUS_KEYS, orderStatusLabel } from '../utils/orderStatus'
import './AdminPages.css'

const STATUSES = ORDER_STATUS_KEYS

function buildProductNameMap(products) {
  const map = {}
  for (const p of products || []) {
    map[p.id] = p.name
  }
  return map
}

function formatOrderItemsText(items, nameById) {
  if (!Array.isArray(items) || items.length === 0) return '—'
  return items
    .map((it) => {
      const name = nameById[it.product_id] ?? `Товар #${it.product_id}`
      return `${name} (${it.quantity} шт.)`
    })
    .join('; ')
}

function totalItemsQuantity(items) {
  if (!Array.isArray(items)) return 0
  return items.reduce((s, it) => s + (Number(it.quantity) || 0), 0)
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [productNames, setProductNames] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [ordersRes, productsRes] = await Promise.allSettled([
        fetchAdminJson('/api/orders'),
        fetchJson('/api/products'),
      ])
      if (ordersRes.status === 'rejected') {
        throw ordersRes.reason
      }
      const ordersList = ordersRes.value
      setOrders(Array.isArray(ordersList) ? ordersList : [])
      if (productsRes.status === 'fulfilled') {
        const productsList = productsRes.value
        setProductNames(buildProductNameMap(Array.isArray(productsList) ? productsList : []))
      } else {
        setProductNames({})
      }
    } catch (e) {
      setOrders([])
      setProductNames({})
      setError(e?.message || 'Не удалось загрузить заказы')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void load()
    })
  }, [load])

  const changeStatus = async (orderId, status) => {
    setUpdatingId(orderId)
    setError('')
    try {
      await fetchAdminJson(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      await load()
    } catch (e) {
      setError(e?.message || 'Не удалось обновить статус')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading && orders.length === 0) {
    return <p className="admin-msg">Загрузка…</p>
  }

  return (
    <div>
      <h1 className="admin-page__title">Заказы</h1>
      {error ? (
        <p className="admin-msg admin-msg--error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="admin-table-wrap admin-table-wrap--orders">
        <table className="admin-table admin-table--orders">
          <thead>
            <tr>
              <th>ID</th>
              <th>Создан</th>
              <th>Клиент</th>
              <th>Телефон</th>
              <th>Адрес доставки</th>
              <th>Товар</th>
              <th>Количество</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td className="admin-table__cell-nowrap">
                  {o.created_at ? new Date(o.created_at).toLocaleString('ru-RU') : '—'}
                </td>
                <td>{o.customer_name}</td>
                <td className="admin-table__cell-nowrap">{o.phone}</td>
                <td className="admin-table__cell-address">{o.address || '—'}</td>
                <td className="admin-table__cell-products">
                  {formatOrderItemsText(o.items, productNames)}
                </td>
                <td>{totalItemsQuantity(o.items)}</td>
                <td className="admin-table__cell-nowrap">
                  {Number(o.total_price).toLocaleString('ru-RU')} ₽
                </td>
                <td>
                  <select
                    className={`admin-select admin-select--order-status admin-select--order-status-${String(o.status || 'new').toLowerCase()}`}
                    value={o.status}
                    disabled={updatingId === o.id}
                    aria-label={`Статус заказа ${o.id}`}
                    onChange={(e) => changeStatus(o.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {orderStatusLabel(s)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && !loading ? (
        <p className="admin-msg">Заказов пока нет.</p>
      ) : null}
    </div>
  )
}
