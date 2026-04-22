import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {
    toggleWishlist(state, action) {
      const idx = state.items.findIndex(i => i.id === action.payload.id)
      if (idx !== -1) { state.items.splice(idx, 1) }
      else { state.items.push(action.payload) }
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clearWishlist(state) { state.items = [] },
  },
})

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
