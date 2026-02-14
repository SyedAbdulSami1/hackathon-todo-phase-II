export interface User {
  id: string
  email: string
  username: string
  created_at: string
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

export interface CreateTaskRequest {
  title: string
  description?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  status?: 'pending' | 'in_progress' | 'completed'
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export type TaskStatus = 'all' | 'pending' | 'in_progress' | 'completed'
export type TaskSort = 'created' | 'title' | 'due_date'

export interface ApiError {
  message: string
  status: number
  details?: any
}