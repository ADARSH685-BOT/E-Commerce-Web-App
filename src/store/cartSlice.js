import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], coupon: null },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(
        i => i.id === action.payload.id && i.size === action.payload.size && i.color === action.payload.color
      )
      if (existing) {
        existing.quantity += action.payload.quantity || 1
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 })
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        i => !(i.id === action.payload.id && i.size === action.payload.size && i.color === action.payload.color)
      )
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(
        i => i.id === action.payload.id && i.size === action.payload.size && i.color === action.payload.color
      )
      if (item) item.quantity = Math.max(1, action.payload.quantity)
    },
    clearCart: (state) => { state.items = []; state.coupon = null },
    applyCoupon: (state, action) => { state.coupon = action.payload },
    removeCoupon: (state) => { state.coupon = null },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions
export default cartSlice.reducer
