import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 100000,
    rating: 0,
    sortBy: 'popularity',
    searchQuery: '',
  },
  reducers: {
    setFilter: (state, action) => { return { ...state, ...action.payload } },
    resetFilters: () => ({
      category: '', brand: '', minPrice: 0,
      maxPrice: 100000, rating: 0, sortBy: 'popularity', searchQuery: '',
    }),
  },
})

export const { setFilter, resetFilters } = filterSlice.actions
export default filterSlice.reducer
