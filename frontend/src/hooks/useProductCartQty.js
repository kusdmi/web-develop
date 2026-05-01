import { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/useCart'

export const QTY_MAX = 99

/** Сколько мс показывать «0» после снятия последней единицы с корзины */
const QTY_ZERO_DISPLAY_MS = 420

/**
 * Количество на карточке/странице товара: до добавления — локально,
 * после добавления в корзину — то же число, что в корзине; ± меняют корзину.
 */
export function useProductCartQty(productId) {
  const { items, addToCart, setLineQuantity, removeLine } = useCart()
  const line = items.find(
    (l) => String(l.product.id) === String(productId),
  )
  const inCart = Boolean(line)
  const [localQty, setLocalQty] = useState(1)
  const [showZeroAfterRemove, setShowZeroAfterRemove] = useState(false)
  const wasInCartRef = useRef(false)
  const zeroTimeoutRef = useRef(null)

  const clearZeroTimeout = () => {
    if (zeroTimeoutRef.current) {
      clearTimeout(zeroTimeoutRef.current)
      zeroTimeoutRef.current = null
    }
  }

  useEffect(() => {
    if (line) {
      wasInCartRef.current = true
    } else if (wasInCartRef.current) {
      wasInCartRef.current = false
      setLocalQty(1)
    }
  }, [line])

  useEffect(() => () => clearZeroTimeout(), [])

  const qty = showZeroAfterRemove
    ? 0
    : inCart
      ? line.quantity
      : localQty

  const qtyBusy = showZeroAfterRemove

  const increment = () => {
    if (qtyBusy) return
    if (inCart) {
      const current = line.quantity
      setLineQuantity(productId, Math.min(QTY_MAX, current + 1))
    } else {
      setLocalQty((q) => Math.min(QTY_MAX, q + 1))
    }
  }

  const decrement = () => {
    if (qtyBusy) return
    if (inCart) {
      const current = line.quantity
      if (current === 1) {
        setShowZeroAfterRemove(true)
        setLineQuantity(productId, 0)
        clearZeroTimeout()
        zeroTimeoutRef.current = setTimeout(() => {
          setShowZeroAfterRemove(false)
          zeroTimeoutRef.current = null
        }, QTY_ZERO_DISPLAY_MS)
      } else {
        setLineQuantity(productId, current - 1)
      }
    } else {
      setLocalQty((q) => Math.max(1, q - 1))
    }
  }

  const removeFromCart = () => {
    clearZeroTimeout()
    setShowZeroAfterRemove(false)
    removeLine(productId)
  }

  return {
    qty,
    inCart,
    qtyBusy,
    addToCart,
    increment,
    decrement,
    removeFromCart,
  }
}
