import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { User, Role, LoginRequest, SignUpRequest } from '@/types/auth'

interface AuthContextType {
  user: User | null
  login: (credentials: LoginRequest) => Promise<void>
  signUp: (userData: SignUpRequest) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await api.get('/api/auth/me')
        setUser(response.data.user)
      } catch (err) {
        // User not authenticated
      } finally {
        setIsLoading(false)
      }
    }
    initializeAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await api.post('/api/auth/login', credentials)
      setUser(response.data.user)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (userData: SignUpRequest) => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await api.post('/api/auth/signup', userData)
      setUser(response.data.user)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign up failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    api.defaults.headers.common['Authorization'] = ''
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const value = {
    user,
    login,
    signUp,
    logout,
    updateUser,
    isLoading,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}