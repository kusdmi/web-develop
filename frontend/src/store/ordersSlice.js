import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchJson } from '../api/fetchJson'

export const createOrder = createAsyncThunk('orders/create', async (payload) => {
  return await fetchJson('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
})

const initialState = {
  createStatus: 'idle',
  createError: null,
  lastCreated: null,
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
  },
})

export const { clearLastCreated } = ordersSlice.actions
export const ordersReducer = ordersSlice.reducer

export const selectLastCreatedOrder = (state) => state.orders.lastCreated
export const selectCreateOrderStatus = (state) => state.orders.createStatus
export const selectCreateOrderError = (state) => state.orders.createError
