import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchJson } from '../api/fetchJson'

export const createOrder = createAsyncThunk('orders/create', async (payload) => {
  return await fetchJson('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
})

export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => {
  return await fetchJson('/api/orders')
})

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (orderId) => {
  const id = Number(orderId)
  return await fetchJson(`/api/orders/${id}`)
})

const initialState = {
  createStatus: 'idle',
  createError: null,
  lastCreated: null,
  listStatus: 'idle',
  listError: null,
  orders: [],
  byIdStatus: {},
  byIdError: {},
  byId: {},
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearLastCreated(state) {
      state.lastCreated = null
      state.createStatus = 'idle'
      state.createError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.createStatus = 'loading'
        state.createError = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.lastCreated = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.createError = action.error?.message || 'Не удалось оформить заказ'
      })
      .addCase(fetchOrders.pending, (state) => {
        state.listStatus = 'loading'
        state.listError = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.listStatus = 'succeeded'
        state.orders = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.listStatus = 'failed'
        state.listError = action.error?.message || 'Не удалось загрузить заказы'
      })
      .addCase(fetchOrderById.pending, (state, action) => {
        const id = Number(action.meta.arg)
        if (!Number.isFinite(id)) return
        state.byIdStatus[id] = 'loading'
        state.byIdError[id] = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        const order = action.payload
        const id = Number(order?.id)
        if (!Number.isFinite(id)) return
        state.byIdStatus[id] = 'succeeded'
        state.byIdError[id] = null
        state.byId[id] = order
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        const id = Number(action.meta.arg)
        if (!Number.isFinite(id)) return
        state.byIdStatus[id] = 'failed'
        state.byIdError[id] = action.error?.message || 'Не удалось загрузить заказ'
      })
  },
})

export const { clearLastCreated } = ordersSlice.actions
export const ordersReducer = ordersSlice.reducer

export const selectLastCreatedOrder = (state) => state.orders.lastCreated
export const selectCreateOrderStatus = (state) => state.orders.createStatus
export const selectCreateOrderError = (state) => state.orders.createError
export const selectOrderById = (state, id) => state.orders.byId[Number(id)] || null
export const selectOrderByIdStatus = (state, id) =>
  state.orders.byIdStatus[Number(id)] || 'idle'
export const selectOrderByIdError = (state, id) =>
  state.orders.byIdError[Number(id)] || null

