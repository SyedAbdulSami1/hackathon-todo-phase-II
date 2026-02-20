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

export class ApiClient {
  private instance: AxiosInstance

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  // ============================================
  // Private Methods
  // ============================================

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
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

  private handleResponse = <T>(response: AxiosResponse<T>): T => {
    return response.data
  }

  private handleError = (error: AxiosError): never => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    throw this.normalizeError(error)
  }

  private normalizeError(error: unknown): ApiError {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response
      // FastAPI errors are usually in { "detail": "message" } format
      const message = (data as any)?.detail || (data as any)?.error?.message || `Error ${status}`
      return {
        message: typeof message === 'string' ? message : JSON.stringify(message),
        status: status,
        details: (data as any)?.error?.details || (data as any)?.detail,
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
  // Task Methods
  // ============================================

  getTasks = async (status?: TaskStatus): Promise<Task[]> => {
    const params = status ? { status } : {}
    return this.instance.get<ApiResponse<Task[]>>('/api/tasks', { params }).then(this.handleResponse)
  }

  createTask = async (data: CreateTaskRequest): Promise<Task> => {
    return this.instance.post<ApiResponse<Task>>('/api/tasks', data).then(this.handleResponse)
  }

  updateTask = async (id: number, data: UpdateTaskRequest): Promise<Task> => {
    return this.instance.put<ApiResponse<Task>>(`/api/tasks/${id}`, data).then(this.handleResponse)
  }

  deleteTask = async (id: number): Promise<void> => {
    await this.instance.delete<ApiResponse<void>>(`/api/tasks/${id}`)
  }

  // ============================================
  // Auth Methods
  // ============================================

  login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    // OAuth2PasswordRequestForm expects x-www-form-urlencoded
    const params = new URLSearchParams()
    params.append('username', credentials.username || (credentials as any).email || '')
    params.append('password', credentials.password)

    return this.instance.post<ApiResponse<AuthResponse>>('/api/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(this.handleResponse)
  }

  register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    return this.instance.post<ApiResponse<AuthResponse>>('/api/auth/register', userData).then(this.handleResponse)
  }

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

// Helper function for error handling
export function getApiError(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as ApiError).message
  }
  return 'An error occurred'
}