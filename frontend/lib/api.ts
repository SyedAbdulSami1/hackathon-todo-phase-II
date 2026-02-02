import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
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

export const apiClient = {
  // Task operations
  getTasks: async (status?: 'all' | 'pending' | 'completed'): Promise<Task[]> => {
    const params = status ? { status } : {}
    const response = await api.get('/api/tasks', { params })
    return response.data
  },

  createTask: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post('/api/tasks', data)
    return response.data
  },

  updateTask: async (id: number, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put(`/api/tasks/${id}`, data)
    return response.data
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/api/tasks/${id}`)
  },
}

export default api