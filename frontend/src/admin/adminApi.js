import { fetchJson } from '../api/fetchJson'
import { getAdminToken } from './adminToken'

export async function fetchAdminJson(path, options = {}) {
  const token = getAdminToken()
  const headers = {
    ...(options.headers || {}),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return fetchJson(path, { ...options, headers })
}

export function publicProductImageUrl(storedPath) {
  if (storedPath == null || storedPath === '') return null
  const s = String(storedPath).trim()
  if (!s) return null
  if (s.startsWith('/static')) return `/api${s}`
  return s
}

export async function uploadAdminProductImage(file) {
  const token = getAdminToken()
  if (!token) throw new Error('Нужна авторизация администратора')

  const body = new FormData()
  body.append('file', file)

  const res = await fetch('/api/products/admin/upload-image', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    void 0
  }

  if (!res.ok) {
    const msg =
      typeof data?.detail === 'string' ? data.detail : `${res.status} ${res.statusText}`
    throw new Error(msg)
  }
  if (!data?.path) throw new Error('Некорректный ответ сервера')
  return data.path
}
