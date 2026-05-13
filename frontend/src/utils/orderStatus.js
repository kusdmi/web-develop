const ORDER_STATUS_LABELS = {
  new: 'Новый',
  processing: 'В обработке',
  completed: 'Выполнен',
  cancelled: 'Отменён',
}

export const ORDER_STATUS_KEYS = Object.keys(ORDER_STATUS_LABELS)

export function orderStatusLabel(status) {
  if (status == null || status === '') return '—'
  const key = String(status).toLowerCase()
  return ORDER_STATUS_LABELS[key] ?? status
}
