export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  completed?: boolean
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

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export type TaskStatus = 'all' | 'pending' | 'completed'
export type TaskSort = 'created' | 'title' | 'due_date'

export interface ApiError {
  message: string
  status: number
  details?: any
}