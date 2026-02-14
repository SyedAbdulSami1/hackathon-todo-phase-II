import { apiClient } from './api-client'
import { User, LoginRequest, RegisterRequest } from '@/types'

export const authClient = {
  login: async (data: LoginRequest): Promise<{ user: User; token: string }> => {
    // Backend expects username, so we send the provided username
    const response = await apiClient.login({ username: data.username, password: data.password });
    return { user: response.user, token: response.token };
  },

  register: async (data: RegisterRequest): Promise<{ user: User; token: string }> => {
    // Backend expects username and email, so we send both
    const response = await apiClient.register({ username: data.username, email: data.email, password: data.password });
    return { user: response.user, token: response.token };
  },

  logout: (): void => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('auth_token')
    if (!token) return null

    try {
      const response = await apiClient.getCurrentUser()
      return response
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