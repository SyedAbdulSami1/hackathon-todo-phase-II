// ============================================
// Domain Types
// ============================================

export interface User {
  id: string
  username: string
  email: string
  created_at: string
  role?: string
  permissions?: string[]
  avatar?: string
  phone?: string
  company?: string
  location?: string
  email_verified?: boolean
}

export interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
  updated_at: string
  user_id: string
}

// ============================================
// Request Types (using Pick/Omit for DRY)
// ============================================

export type CreateTaskRequest = Pick<Task, 'title' | 'description' | 'status'>

export type UpdateTaskRequest = Partial<CreateTaskRequest>

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  status: number
  details?: Array<{
    field: string
    message: string
  }>
}

export interface AuthResponse {
  user: User
  token: string
}

// ============================================
// Utility Types
// ============================================

export type TaskStatus = 'all' | 'pending' | 'in_progress' | 'completed'
export type TaskSort = 'created' | 'title' | 'due_date'

// Discriminated union for task filter state
export type TaskFilterState = {
  status: TaskStatus
  sort: TaskSort
  search?: string
}

// ============================================
// Type Guards
// ============================================

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  )
}

export function isTask(obj: unknown): obj is Task {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'completed' in obj
  )
}

// ============================================
// Helper Types for Forms
// ============================================

export type FormState<T> = {
  data: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
}

export type AsyncState<T> = {
  data: T | null
  isLoading: boolean
  error: ApiError | null
}
