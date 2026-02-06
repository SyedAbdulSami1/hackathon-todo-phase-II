import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TaskList } from '@/components/task-list'
import { Task } from '@/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
  getApiError: jest.fn(() => 'Mock error')
}))

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Test Task 1',
    description: 'Description 1',
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: '1'
  },
  {
    id: 2,
    title: 'Test Task 2',
    description: 'Description 2',
    completed: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: '1'
  }
]

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
})

function renderComponent() {
  return render(
    <QueryClientProvider client={queryClient}>
      <TaskList />
    </QueryClientProvider>
  )
}

describe('TaskList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  it('renders loading state initially', () => {
    renderComponent()
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
  })

  it('renders tasks after loading', async () => {
    const { apiClient } = require('@/lib/api')
    apiClient.getTasks.mockResolvedValue(mockTasks)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })
  })

  it('can filter tasks by status', async () => {
    const { apiClient } = require('@/lib/api')
    apiClient.getTasks.mockImplementation((status?: string) => {
      if (status === 'completed') {
        return mockTasks.filter(task => task.completed)
      }
      return mockTasks
    })

    renderComponent()

    await waitFor(() => {
      // Initially shows all tasks
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })

    // Click completed filter
    fireEvent.click(screen.getByText('Completed'))

    // Should only show completed tasks
    expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument()
  })

  it('creates a new task', async () => {
    const { apiClient } = require('@/lib/api')
    apiClient.getTasks.mockResolvedValue([])
    apiClient.createTask.mockResolvedValue({
      id: 3,
      title: 'New Task',
      description: 'New Description',
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1'
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument()
    })

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Task title'), {
      target: { value: 'New Task' }
    })
    fireEvent.change(screen.getByPlaceholderText('Task description'), {
      target: { value: 'New Description' }
    })

    // Submit form
    fireEvent.click(screen.getByText('Add Task'))

    await waitFor(() => {
      expect(apiClient.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description'
      })
    })
  })

  it('shows error message when API fails', async () => {
    const { apiClient } = require('@/lib/api')
    apiClient.getTasks.mockRejectedValue(new Error('API Error'))

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument()
    })
  })

  it('toggles task completion', async () => {
    const { apiClient } = require('@/lib/api')
    apiClient.getTasks.mockResolvedValue(mockTasks)
    apiClient.updateTask.mockResolvedValue({
      ...mockTasks[0],
      completed: true
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    })

    // Click checkbox to mark as complete
    fireEvent.click(screen.getByTestId(`task-checkbox-${mockTasks[0].id}`))

    await waitFor(() => {
      expect(apiClient.updateTask).toHaveBeenCalledWith(
        mockTasks[0].id,
        { completed: true }
      )
    })
  })

  it('deletes a task with confirmation', async () => {
    const { apiClient } = require('@/lib/api')
    apiClient.getTasks.mockResolvedValue(mockTasks)
    apiClient.deleteTask.mockResolvedValue()

    // Mock window.confirm to return true
    jest.spyOn(window, 'confirm').mockReturnValue(true)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    })

    // Click delete button
    fireEvent.click(screen.getByTestId(`task-delete-${mockTasks[0].id}`))

    await waitFor(() => {
      expect(apiClient.deleteTask).toHaveBeenCalledWith(mockTasks[0].id)
    })

    // Restore window.confirm
    window.confirm.mockRestore()
  })

  it('does not delete task when confirmation is cancelled', async () => {
    const { apiClient } = require('@/lib/api')
    apiClient.getTasks.mockResolvedValue(mockTasks)

    // Mock window.confirm to return false
    jest.spyOn(window, 'confirm').mockReturnValue(false)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    })

    // Click delete button
    fireEvent.click(screen.getByTestId(`task-delete-${mockTasks[0].id}`))

    await waitFor(() => {
      expect(apiClient.deleteTask).not.toHaveBeenCalled()
    })

    // Restore window.confirm
    window.confirm.mockRestore()
  })
})