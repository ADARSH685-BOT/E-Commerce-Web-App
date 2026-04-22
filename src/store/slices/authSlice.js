import { createSlice } from '@reduxjs/toolkit'

const loadCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem('currentUser')) || null } catch { return null }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { currentUser: loadCurrentUser(), isAuthenticated: !!loadCurrentUser() },
  reducers: {
    loginSuccess(state, action) {
      state.currentUser = action.payload
      state.isAuthenticated = true
      localStorage.setItem('currentUser', JSON.stringify(action.payload))
    },
    logout(state) {
      state.currentUser = null
      state.isAuthenticated = false
      localStorage.removeItem('currentUser')
    },
    updateProfile(state, action) {
      state.currentUser = { ...state.currentUser, ...action.payload }
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser))
      // update in users list too
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const idx = users.findIndex(u => u.email === state.currentUser.email)
      if (idx !== -1) { users[idx] = { ...users[idx], ...action.payload }; localStorage.setItem('users', JSON.stringify(users)) }
    },
  },
})

export const { loginSuccess, logout, updateProfile } = authSlice.actions
export default authSlice.reducer
