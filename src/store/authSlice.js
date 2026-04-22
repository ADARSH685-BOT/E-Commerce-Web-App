import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    isAuthenticated: !!localStorage.getItem('currentUser'),
  },
  reducers: {
    register: (state, action) => {
      const { name, email, password } = action.payload
      const exists = state.users.find(u => u.email === email)
      if (exists) throw new Error('Email already registered')
      const newUser = { id: Date.now(), name, email, password }
      state.users.push(newUser)
      localStorage.setItem('users', JSON.stringify(state.users))
    },
    login: (state, action) => {
      const { email, password } = action.payload
      const user = state.users.find(u => u.email === email && u.password === password)
      if (!user) throw new Error('Invalid email or password')
      state.currentUser = user
      state.isAuthenticated = true
      localStorage.setItem('currentUser', JSON.stringify(user))
    },
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      localStorage.removeItem('currentUser')
    },
    updateProfile: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload }
      localStorage.setItem('currentUser', JSON.stringify(state.currentUser))
    },
  },
})

export const { register, login, logout, updateProfile } = authSlice.actions
export default authSlice.reducer
