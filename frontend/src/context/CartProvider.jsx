import { useCallback, useMemo, useState } from 'react'
import { CartContext } from './cartContextBase'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((line) => line.product.id === product.id)
      if (i === -1) {
        return [...prev, { product, quantity }]
      }
      const next = [...prev]
      next[i] = { ...next[i], quantity: next[i].quantity + quantity }
      return next
    })
  }, [])

  const setLineQuantity = useCallback((productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((line) => line.product.id !== productId)
      }
      return prev.map((line) =>
        line.product.id === productId ? { ...line, quantity } : line,
      )
    })
  }, [])

  const removeLine = useCallback((productId) => {
    setItems((prev) => prev.filter((line) => line.product.id !== productId))
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
