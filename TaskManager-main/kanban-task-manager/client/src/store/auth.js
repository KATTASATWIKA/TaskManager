import { create } from 'zustand'
import { authAPI } from '../api/client'

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  // Initialize auth state
  init: async () => {
    try {
      const response = await authAPI.getMe()
      set({ user: response.data, loading: false })
    } catch (error) {
      set({ user: null, loading: false })
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      set({ user: response.data })
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  },

  // Register
  register: async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password)
      set({ user: response.data })
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      set({ user: null })
    }
  },
}))

export { useAuthStore }