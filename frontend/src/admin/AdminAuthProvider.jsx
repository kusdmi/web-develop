import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchJson } from '../api/fetchJson'
import { AdminAuthContext } from './adminAuthContext'
import {
  clearAdminToken,
  getAdminUsername,
  setAdminToken,
  setAdminUsername,
  STORAGE_KEY,
} from './adminToken'

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(STORAGE_KEY)
  })
  const [adminUsername, setAdminUsernameState] = useState(() => {
    if (typeof window === 'undefined') return null
    return getAdminUsername()
  })
  const navigate = useNavigate()

  const login = useCallback(async (username, password) => {
    const data = await fetchJson('/api/products/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const t = data?.access_token
    if (!t) throw new Error('Нет токена в ответе')
    const name = String(username).trim()
    setAdminToken(t)
    setAdminUsername(name)
    setToken(t)
    setAdminUsernameState(name)
    navigate('/admin/products', { replace: true })
  }, [navigate])

  const logout = useCallback(() => {
    clearAdminToken()
    setToken(null)
    setAdminUsernameState(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo(
    () => ({
      token,
      adminUsername,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, adminUsername, login, logout],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
