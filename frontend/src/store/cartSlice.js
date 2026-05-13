import { createSelector, createSlice } from '@reduxjs/toolkit'
import { readStoredCart, writeStoredCart } from './storage'

export const QTY_MAX = 99

const initialState = {
  lines: readStoredCart(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const productId = Number(action.payload?.productId)
      const quantityRaw = Number(action.payload?.quantity ?? 1)
      if (!Number.isFinite(productId) || productId <= 0) return
      const quantity = Math.min(QTY_MAX, Math.max(1, Math.floor(quantityRaw)))

      const idx = state.lines.findIndex((l) => l.productId === productId)
      if (idx === -1) {
        state.lines.push({ productId, quantity })
      } else {
        state.lines[idx].quantity = Math.min(QTY_MAX, state.lines[idx].quantity + quantity)
      }
      writeStoredCart(state.lines)
    },
    setLineQuantity(state, action) {
      const productId = Number(action.payload?.productId)
      const quantityRaw = Number(action.payload?.quantity)
      if (!Number.isFinite(productId) || productId <= 0) return
      if (!Number.isFinite(quantityRaw)) return
      const quantity = Math.floor(quantityRaw)
      if (quantity <= 0) {
        state.lines = state.lines.filter((l) => l.productId !== productId)
        writeStoredCart(state.lines)
        return
      }
      const clamped = Math.min(QTY_MAX, Math.max(1, quantity))
      const idx = state.lines.findIndex((l) => l.productId === productId)
      if (idx === -1) state.lines.push({ productId, quantity: clamped })
      else state.lines[idx].quantity = clamped
      writeStoredCart(state.lines)
    },
    removeLine(state, action) {
      const productId = Number(action.payload?.productId ?? action.payload)
      if (!Number.isFinite(productId) || productId <= 0) return
      state.lines = state.lines.filter((l) => l.productId !== productId)
      writeStoredCart(state.lines)
    },
    clearCart(state) {
      state.lines = []
      writeStoredCart(state.lines)
    },
  },
})

export const { addToCart, setLineQuantity, removeLine, clearCart } = cartSlice.actions
export const cartReducer = cartSlice.reducer

export const selectCartLines = (state) => state.cart.lines
const selectProductEntities = (state) => state.products.entities

export const selectCartTotalItems = createSelector([selectCartLines], (lines) =>
  lines.reduce((s, l) => s + l.quantity, 0),
)

export const selectCartEnrichedLines = createSelector(
  [selectCartLines, selectProductEntities],
  (lines, byId) =>
    lines.map((l) => ({
    product: byId[l.productId] || null,
    productId: l.productId,
    quantity: l.quantity,
    })),
)

export const selectCartTotalPrice = createSelector(
  [selectCartLines, selectProductEntities],
  (lines, byId) =>
    lines.reduce((s, l) => {
    const p = byId[l.productId]
    const price = p ? Number(p.price) : 0
    return s + price * l.quantity
    }, 0),
)

