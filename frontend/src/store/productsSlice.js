import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { fetchJson } from '../api/fetchJson'

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  return await fetchJson('/api/products')
})

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id) => {
    const n = Number(id)
    return await fetchJson(`/api/products/${n}`)
  },
)

function normalizeProduct(p) {
  const id = Number(p?.id)
  if (!Number.isFinite(id) || id <= 0) return null
  return {
    id,
    sku: String(p?.sku ?? ''),
    name: String(p?.name ?? ''),
    description: p?.description == null ? '' : String(p.description),
    category: String(p?.category ?? ''),
    price: Number(p?.price ?? 0),
    stock: Number(p?.stock ?? 0),
    imageUrl: (() => {
      const raw = p?.image_url == null ? '' : String(p.image_url).trim()
      if (!raw) return null
      if (raw.startsWith('/static')) return `/api${raw}`
      return raw
    })(),
    createdAt: p?.created_at ?? null,
  }
}

const initialState = {
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  entities: {}, // id -> product
  ids: [],
  byIdStatus: {}, // id -> status
  byIdError: {}, // id -> error
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        const list = Array.isArray(action.payload) ? action.payload : []
        const entities = {}
        const ids = []
        for (const raw of list) {
          const p = normalizeProduct(raw)
          if (!p) continue
          entities[p.id] = p
          ids.push(p.id)
        }
        state.entities = entities
        state.ids = ids
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error?.message || 'Не удалось загрузить каталог'
      })
      .addCase(fetchProductById.pending, (state, action) => {
        const id = Number(action.meta.arg)
        if (!Number.isFinite(id)) return
        state.byIdStatus[id] = 'loading'
        state.byIdError[id] = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const p = normalizeProduct(action.payload)
        if (!p) return
        state.entities[p.id] = p
        if (!state.ids.includes(p.id)) state.ids.push(p.id)
        state.byIdStatus[p.id] = 'succeeded'
        state.byIdError[p.id] = null
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        const id = Number(action.meta.arg)
        if (!Number.isFinite(id)) return
        state.byIdStatus[id] = 'failed'
        state.byIdError[id] = action.error?.message || 'Не удалось загрузить товар'
      })
  },
})

export const productsReducer = productsSlice.reducer

export const selectProductsStatus = (state) => state.products.status
export const selectProductsError = (state) => state.products.error
const selectProductIds = (state) => state.products.ids
const selectProductEntities = (state) => state.products.entities

export const selectAllProducts = createSelector(
  [selectProductIds, selectProductEntities],
  (ids, entities) => ids.map((id) => entities[id]),
)

export const selectProductById = (state, id) => state.products.entities[Number(id)] || null
export const selectProductByIdStatus = (state, id) =>
  state.products.byIdStatus[Number(id)] || 'idle'
export const selectProductByIdError = (state, id) => state.products.byIdError[Number(id)] || null

export const selectCategories = createSelector([selectAllProducts], (products) => {
  const set = new Set()
  for (const p of products) {
    const c = p?.category
    if (c) set.add(c)
  }
  return ['Все', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'ru'))]
})

