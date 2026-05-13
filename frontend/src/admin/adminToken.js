export const STORAGE_KEY = 'shop-admin-token'
export const USERNAME_STORAGE_KEY = 'shop-admin-username'

function decodeJwtSub(token) {
  try {
    const parts = String(token).split('.')
    if (parts.length < 2) return null
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const pad = base64.length % 4
    if (pad) base64 += '='.repeat(4 - pad)
    const json = JSON.parse(atob(base64))
    const sub = json?.sub
    return typeof sub === 'string' && sub.trim() ? sub.trim() : null
  } catch {
    return null
  }
}

export function getAdminToken() {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(STORAGE_KEY)
}

export function setAdminToken(token) {
  sessionStorage.setItem(STORAGE_KEY, token)
}

export function setAdminUsername(username) {
  if (username == null || String(username).trim() === '') {
    sessionStorage.removeItem(USERNAME_STORAGE_KEY)
    return
  }
  sessionStorage.setItem(USERNAME_STORAGE_KEY, String(username).trim())
}

export function getAdminUsername() {
  if (typeof window === 'undefined') return null
  const stored = sessionStorage.getItem(USERNAME_STORAGE_KEY)
  if (stored) return stored
  const t = getAdminToken()
  if (!t) return null
  const sub = decodeJwtSub(t)
  if (sub) sessionStorage.setItem(USERNAME_STORAGE_KEY, sub)
  return sub
}

export function clearAdminToken() {
  sessionStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(USERNAME_STORAGE_KEY)
}
