import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  removeLine,
  selectCartLines,
  setLineQuantity,
  QTY_MAX,
} from '../store/cartSlice'

export { QTY_MAX } from '../store/cartSlice'

/** Сколько мс показывать «0» после снятия последней единицы с корзины */
const QTY_ZERO_DISPLAY_MS = 420

/**
 * Количество на карточке/странице товара: до добавления — локально,
 * после добавления в корзину — то же число, что в корзине; ± меняют корзину.
 */
export function useProductCartQty(productId) {
  const dispatch = useDispatch()
  const lines = useSelector(selectCartLines)
  const pid = Number(productId)
  const line = lines.find((l) => l.productId === pid)
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
      dispatch(setLineQuantity({ productId: pid, quantity: Math.min(QTY_MAX, current + 1) }))
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
        dispatch(setLineQuantity({ productId: pid, quantity: 0 }))
        clearZeroTimeout()
        zeroTimeoutRef.current = setTimeout(() => {
          setShowZeroAfterRemove(false)
          zeroTimeoutRef.current = null
        }, QTY_ZERO_DISPLAY_MS)
      } else {
        dispatch(setLineQuantity({ productId: pid, quantity: current - 1 }))
      }
    } else {
      setLocalQty((q) => Math.max(1, q - 1))
    }
  }

  const removeFromCart = () => {
    clearZeroTimeout()
    setShowZeroAfterRemove(false)
    dispatch(removeLine({ productId: pid }))
  }

  return {
    qty,
    inCart,
    qtyBusy,
    addToCart: (_product, quantity = 1) =>
      dispatch(addToCart({ productId: pid, quantity })),
    increment,
    decrement,
    removeFromCart,
  }
}
