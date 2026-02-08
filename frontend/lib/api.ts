import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStatus,
  ApiResponse,
  ApiError,
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '@/types'

// ============================================
// Configuration
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ============================================
// API Client Class
// ============================================

class ApiClient {
  private instance: AxiosInstance
  public token: string | null = null

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }

    this.setupInterceptors()
  }

  // ============================================
  // Private Methods
  // ============================================

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for auth errors
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleError
    )
  }

  private handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
    return response.data.data
  }

  private handleError = (error: AxiosError): never => {
    if (error.response?.status === 401) {
      this.clearAuth()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    throw this.normalizeError(error)
  }

  private normalizeError(error: unknown): ApiError {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response
      return {
        message: (data as any)?.error?.message || `Error ${status}`,
        status: status,
        details: (data as any)?.error?.details,
      }
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        status: 0,
      }
    }

    return {
      message: 'An unknown error occurred',
      status: 500,
    }
  }

  // ============================================
  // Auth Methods
  // ============================================

  login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Login endpoint expects form data, not JSON
    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    const response = await this.instance.post<ApiResponse<AuthResponse>>('/api/auth/login', formData)
    this.setAuth(response.data.token)
    return response.data
  }

  register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await this.instance.post<ApiResponse<AuthResponse>>('/api/auth/register', userData)
    this.setAuth(response.data.token)
    return response.data
  }

  logout = (): void => {
    this.clearAuth()
  }

  private setAuth(token: string): void {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  private clearAuth(): void {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // ============================================
  // Task Methods
  // ============================================

  getTasks = async (status?: TaskStatus): Promise<Task[]> => {
    const params = status ? { status } : {}
    return this.instance.get<ApiResponse<Task[]>>('/api/tasks', { params }).then(this.handleResponse)
  }

  createTask = async (data: CreateTaskRequest): Promise<Task> => {
    // Set default status if not provided
    if (!data.status) {
      data = { ...data, status: 'pending' }
    }
    return this.instance.post<ApiResponse<Task>>('/api/tasks', data).then(this.handleResponse)
  }

  updateTask = async (id: number, data: UpdateTaskRequest): Promise<Task> => {
    return this.instance.put<ApiResponse<Task>>(`/api/tasks/${id}`, data).then(this.handleResponse)
  }

  deleteTask = async (id: number): Promise<void> => {
    await this.instance.delete<ApiResponse<void>>(`/api/tasks/${id}`)
  }

  // ============================================
  // User Methods
  // ============================================

  getCurrentUser = async (): Promise<User> => {
    return this.instance.get<ApiResponse<User>>('/api/auth/me').then(this.handleResponse)
  }

  // ============================================
  // Generic Methods
  // ============================================

  get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return this.instance.get<ApiResponse<T>>(url, config).then(this.handleResponse)
  }

  post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return this.instance.post<ApiResponse<T>>(url, data, config).then(this.handleResponse)
  }

  put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return this.instance.put<ApiResponse<T>>(url, data, config).then(this.handleResponse)
  }

  delete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return this.instance.delete<ApiResponse<T>>(url, config).then(this.handleResponse)
  }
}

// ============================================
// Export
// ============================================

export const apiClient = new ApiClient(API_BASE_URL)

// Legacy export for backward compatibility
export default apiClient

// Helper function for error handling (can be removed once all code is updated)
export function getApiError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as ApiError).message
  }
  return 'An error occurred'
}