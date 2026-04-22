import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], coupon: null },
  reducers: {
    addToCart(state, action) {
      const { product, quantity = 1, size, color } = action.payload
      const key = `${product.id}-${size}-${color}`
      const existing = state.items.find(i => i.key === key)
      if (existing) { existing.quantity += quantity }
      else { state.items.push({ ...product, quantity, size, color, key }) }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.key !== action.payload)
    },
    updateQuantity(state, action) {
      const { key, quantity } = action.payload
      const item = state.items.find(i => i.key === key)
      if (item) { item.quantity = Math.max(1, quantity) }
    },
    clearCart(state) { state.items = []; state.coupon = null },
    applyCoupon(state, action) { state.coupon = action.payload },
    removeCoupon(state) { state.coupon = null },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions
export default cartSlice.reducer
