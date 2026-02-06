import { apiClient } from './api'
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types'

// ============================================
// Auth Service Class
// ============================================

class AuthService {
  // ============================================
  // Public Methods
  // ============================================

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.login(credentials)
    return response
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.register(userData)
    return response
  }

  logout(): void {
    apiClient.logout()
    // Clear user from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await apiClient.getCurrentUser()
      return user
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!apiClient.token
  }

  saveAuth(token: string, user: User): void {
    // Token is already saved by apiClient
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null

    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  // ============================================
  // Token Management
  // ============================================

  getToken(): string | null {
    return apiClient.token
  }

  clearAuth(): void {
    this.logout()
  }

  // ============================================
  // Session Persistence
  // ============================================

  // Check if user session is still valid
  async validateSession(): Promise<boolean> {
    try {
      await this.getCurrentUser()
      return true
    } catch {
      return false
    }
  }

  // Get session info without throwing errors
  getSession() {
    const token = this.getToken()
    const user = this.getUser()

    return {
      isAuthenticated: !!token,
      user,
      token,
    }
  }
}

// ============================================
// Export
// ============================================

export const authService = new AuthService()

// Legacy export for backward compatibility
export default authService

// Type guards for auth-related checks
export function isTokenValid(token: string | null): token is string {
  if (!token) return false

  try {
    // Basic JWT validation - check format
    const parts = token.split('.')
    if (parts.length !== 3) return false

    // Decode payload and check expiration
    const payload = JSON.parse(atob(parts[1]))
    const now = Math.floor(Date.now() / 1000)

    return payload.exp > now
  } catch {
    return false
  }
}

// Hook types for React hooks (can be used in custom hooks)
export type UseAuthReturn = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<AuthResponse>
  register: (userData: RegisterRequest) => Promise<AuthResponse>
  logout: () => void
  validateSession: () => Promise<boolean>
}