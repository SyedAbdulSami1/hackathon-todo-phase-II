'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User, AuthResponse, LoginRequest, RegisterRequest, ApiError } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<AuthResponse>
  register: (userData: RegisterRequest) => Promise<AuthResponse>
  logout: () => void
  refreshToken: () => Promise<string>
  updateProfile: (data: Partial<User>) => Promise<User>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  resendVerificationEmail: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
  config?: {
    apiBaseUrl?: string
    storage?: 'localStorage' | 'sessionStorage' | 'cookie'
    tokenKey?: string
    refreshTokenKey?: string
    userKey?: string
    redirectPath?: string
    loginPath?: string
    tokenRefreshThreshold?: number
    enableAutoRefresh?: boolean
    persistSession?: boolean
  }
}

export function AuthProvider({ children, config }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const defaultConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    storage: 'localStorage',
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'user_data',
    redirectPath: '/dashboard',
    loginPath: '/login',
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiration
    enableAutoRefresh: true,
    persistSession: true,
  }

  const finalConfig = { ...defaultConfig, ...config }

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = useCallback(async () => {
    try {
      const token = getStorage(finalConfig.tokenKey)
      const storedUser = getStorage(finalConfig.userKey)
      const storedRefreshToken = getStorage(finalConfig.refreshKey)

      if (token && storedUser) {
        setUser(storedUser)
        setIsAuthenticated(true)
        setRefreshToken(storedRefreshToken)

        // Validate token and refresh if needed
        if (finalConfig.enableAutoRefresh) {
          await validateAndRefreshToken(token)
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      clearAuth()
    } finally {
      setIsLoading(false)
    }
  }, [finalConfig])

  const getStorage = (key: string): any => {
    if (typeof window === 'undefined') return null

    switch (finalConfig.storage) {
      case 'localStorage':
        return localStorage.getItem(key)
      case 'sessionStorage':
        return sessionStorage.getItem(key)
      case 'cookie':
        // Implement cookie reading
        return getCookie(key)
      default:
        return localStorage.getItem(key)
    }
  }

  const setStorage = (key: string, value: string): void => {
    if (typeof window === 'undefined') return

    switch (finalConfig.storage) {
      case 'localStorage':
        localStorage.setItem(key, value)
        break
      case 'sessionStorage':
        sessionStorage.setItem(key, value)
        break
      case 'cookie':
        // Implement cookie setting
        setCookie(key, value)
        break
    }
  }

  const removeStorage = (key: string): void => {
    if (typeof window === 'undefined') return

    switch (finalConfig.storage) {
      case 'localStorage':
        localStorage.removeItem(key)
        break
      case 'sessionStorage':
        sessionStorage.removeItem(key)
        break
      case 'cookie':
        // Implement cookie removal
        removeCookie(key)
        break
    }
  }

  const validateAndRefreshToken = async (token: string): Promise<void> => {
    try {
      // Check if token needs refresh
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Date.now()
      const expiresIn = payload.exp * 1000 - now

      if (expiresIn < finalConfig.tokenRefreshThreshold) {
        await refreshToken()
      }
    } catch (error) {
      console.error('Token validation failed:', error)
      throw error
    }
  }

  const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${finalConfig.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error: ApiError = await response.json()
        throw new Error(error.message)
      }

      const authResponse: AuthResponse = await response.json()

      // Store auth data
      setStorage(finalConfig.tokenKey, authResponse.token)
      setStorage(finalConfig.userKey, JSON.stringify(authResponse.user))
      if (finalConfig.persistSession) {
        setStorage(finalConfig.refreshTokenKey, authResponse.refreshToken || '')
      }

      setUser(authResponse.user)
      setIsAuthenticated(true)
      setRefreshToken(authResponse.refreshToken)

      // Redirect to dashboard
      if (typeof window !== 'undefined') {
        window.location.href = finalConfig.redirectPath
      }

      return authResponse
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [finalConfig])

  const register = useCallback(async (userData: RegisterRequest): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${finalConfig.apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error: ApiError = await response.json()
        throw new Error(error.message)
      }

      const authResponse: AuthResponse = await response.json()

      // Store auth data
      setStorage(finalConfig.tokenKey, authResponse.token)
      setStorage(finalConfig.userKey, JSON.stringify(authResponse.user))
      if (finalConfig.persistSession) {
        setStorage(finalConfig.refreshTokenKey, authResponse.refreshToken || '')
      }

      setUser(authResponse.user)
      setIsAuthenticated(true)
      setRefreshToken(authResponse.refreshToken)

      // Redirect to dashboard
      if (typeof window !== 'undefined') {
        window.location.href = finalConfig.redirectPath
      }

      return authResponse
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [finalConfig])

  const logout = useCallback((): void => {
    clearAuth()

    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = finalConfig.loginPath
    }
  }, [finalConfig])

  const refreshToken = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch(`${finalConfig.apiBaseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getStorage(finalConfig.tokenKey)}`,
        },
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      const newToken = data.token

      setStorage(finalConfig.tokenKey, newToken)
      setUser(data.user)

      return newToken
    } catch (error) {
      console.error('Token refresh failed:', error)
      clearAuth()
      throw error
    }
  }, [finalConfig])

  const updateProfile = useCallback(async (data: Partial<User>): Promise<User> => {
    const token = getStorage(finalConfig.tokenKey)
    const response = await fetch(`${finalConfig.apiBaseUrl}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.message)
    }

    const updatedUser: User = await response.json()
    setUser(updatedUser)
    setStorage(finalConfig.userKey, JSON.stringify(updatedUser))

    return updatedUser
  }, [finalConfig])

  const changePassword = useCallback(async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    const token = getStorage(finalConfig.tokenKey)
    const response = await fetch(`${finalConfig.apiBaseUrl}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.message)
    }
  }, [finalConfig])

  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    const response = await fetch(`${finalConfig.apiBaseUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.message)
    }
  }, [finalConfig])

  const resetPassword = useCallback(async (
    token: string,
    newPassword: string
  ): Promise<void> => {
    const response = await fetch(`${finalConfig.apiBaseUrl}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.message)
    }
  }, [finalConfig])

  const verifyEmail = useCallback(async (token: string): Promise<void> => {
    const response = await fetch(`${finalConfig.apiBaseUrl}/api/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.message)
    }

    // Update user verification status
    if (user) {
      setUser({ ...user, email_verified: true })
      setStorage(finalConfig.userKey, JSON.stringify({ ...user, email_verified: true }))
    }
  }, [finalConfig, user])

  const resendVerificationEmail = useCallback(async (email: string): Promise<void> => {
    const response = await fetch(`${finalConfig.apiBaseUrl}/api/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.message)
    }
  }, [finalConfig])

  const clearAuth = useCallback((): void => {
    setUser(null)
    setIsAuthenticated(false)
    removeStorage(finalConfig.tokenKey)
    removeStorage(finalConfig.userKey)
    removeStorage(finalConfig.refreshTokenKey)
  }, [finalConfig])

  // Cookie helper functions
  const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split('; ')
    const cookie = cookies.find(c => c.startsWith(`${name}=`))
    return cookie ? decodeURIComponent(cookie.substring(name.length + 1)) : null
  }

  const setCookie = (name: string, value: string): void => {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; secure; samesite=strict`
  }

  const removeCookie = (name: string): void => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshToken,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for checking authentication state
export function useAuthState() {
  const { isAuthenticated, user, isLoading } = useAuth()
  return { isAuthenticated, user, isLoading }
}

// Hook for permissions
export function usePermissions(requiredPermissions: string[] = []) {
  const { user } = useAuth()

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false

    // Simple implementation - can be extended with role hierarchy
    return user.permissions?.includes(permission) || user.role === 'admin'
  }, [user])

  const hasAllPermissions = useCallback((): boolean => {
    return requiredPermissions.every(perm => hasPermission(perm))
  }, [requiredPermissions, hasPermission])

  const hasAnyPermission = useCallback((): boolean => {
    return requiredPermissions.some(perm => hasPermission(perm))
  }, [requiredPermissions, hasPermission])

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    userPermissions: user?.permissions || [],
  }
}