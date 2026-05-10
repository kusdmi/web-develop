const CART_STORAGE_KEY = 'shop-demo-cart-v2'

export function readStoredCart() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    const lines = []
    for (const row of data) {
      const productId = Number(row?.productId)
      const quantity = Number(row?.quantity)
      if (!Number.isFinite(productId) || productId <= 0) continue
      if (!Number.isFinite(quantity) || quantity <= 0) continue
      lines.push({ productId, quantity: Math.floor(quantity) })
    }
    return lines
  } catch {
    return []
  }
}

export function writeStoredCart(lines) {
  if (typeof window === 'undefined') return
  try {
    const payload = lines.map(({ productId, quantity }) => ({
      productId,
      quantity,
    }))
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // нет места / приватный режим
  }
}

