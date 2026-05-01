import { useCallback, useEffect, useMemo, useState } from 'react'
import { getProductById } from '../data/mockProducts'
import { QTY_MAX } from '../hooks/useProductCartQty'
import { CartContext } from './cartContextBase'

const CART_STORAGE_KEY = 'shop-demo-cart'

function readStoredCart() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    const lines = []
    for (const row of data) {
      if (
        !row ||
        typeof row.productId !== 'string' ||
        typeof row.quantity !== 'number'
      ) {
        continue
      }
      const product = getProductById(row.productId)
      if (!product) continue
      const quantity = Math.min(
        Math.max(0, Math.floor(row.quantity)),
        QTY_MAX,
      )
      if (quantity > 0) lines.push({ product, quantity })
    }
    return lines
  } catch {
    return []
  }
}

function writeStoredCart(lines) {
  if (typeof window === 'undefined') return
  try {
    const payload = lines.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    }))
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // нет места / приватный режим
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    writeStoredCart(items)
  }, [items])

  const addToCart = useCallback((product, quantity = 1) => {
    const pid = String(product.id)
    setItems((prev) => {
      const i = prev.findIndex((line) => String(line.product.id) === pid)
      if (i === -1) {
        return [...prev, { product, quantity }]
      }
      const next = [...prev]
      next[i] = {
        ...next[i],
        quantity: Math.min(QTY_MAX, next[i].quantity + quantity),
      }
      return next
    })
  }, [])

  const setLineQuantity = useCallback((productId, quantity) => {
    const pid = String(productId)
    const q = Math.floor(Number(quantity))
    setItems((prev) => {
      if (!Number.isFinite(q) || q <= 0) {
        return prev.filter((line) => String(line.product.id) !== pid)
      }
      const clamped = Math.min(Math.max(1, q), QTY_MAX)
      return prev.map((line) =>
        String(line.product.id) === pid ? { ...line, quantity: clamped } : line,
      )
    })
  }, [])

  const removeLine = useCallback((productId) => {
    const pid = String(productId)
    setItems((prev) => prev.filter((line) => String(line.product.id) !== pid))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((s, line) => s + line.quantity, 0),
    [items],
  )

  const totalPrice = useMemo(
    () => items.reduce((s, line) => s + line.product.price * line.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      addToCart,
      setLineQuantity,
      removeLine,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [
      items,
      addToCart,
      setLineQuantity,
      removeLine,
      clearCart,
      totalItems,
      totalPrice,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
