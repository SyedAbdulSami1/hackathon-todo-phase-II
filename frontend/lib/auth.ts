import axios from 'axios'
import { api } from './api'

export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export const authClient = {
  login: async (data: LoginRequest): Promise<{ user: User; token: string }> => {
    const response = await axios.post(`${api.defaults.baseURL}/api/auth/login`, data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<{ user: User; token: string }> => {
    const response = await axios.post(`${api.defaults.baseURL}/api/auth/register`, data)
    return response.data
  },

  logout: (): void => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('auth_token')
    if (!token) return null

    try {
      const response = await api.get('/api/auth/me')
      return response.data
    } catch {
      return null
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token')
  },

  saveAuth: (token: string, user: User): void => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
}

export default authClient