'use client'

import { useState, useEffect } from 'react'
import { TaskCard } from './task-card'
import { TaskFilters } from './task-filters'
import { TaskForm } from './task-form'
import { EmptyState, NoTasksEmptyState, AllTasksCompletedEmptyState, NoFilteredTasksEmptyState } from './empty-state'
import { LoadingSkeleton } from './loading-skeleton'
import { ErrorBoundary } from './error-boundary'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Task, CreateTaskRequest } from '@/lib/api'
import { TaskStatus } from '@/types'
import { cn } from '@/lib/utils'

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<TaskStatus>('all')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [filterStatus])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/tasks?status=${filterStatus}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()
      setTasks(data)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to fetch tasks. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: CreateTaskRequest) => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      await fetchTasks() // Refresh the task list
      setIsCreating(false)
    } catch (err) {
      console.error('Error creating task:', err)
      setIsCreating(false)
      throw err
    }
  }

  const toggleTaskCompletion = async (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task) return

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      await fetchTasks() // Refresh the task list
    } catch (err) {
      console.error('Error updating task:', err)
      setError('Failed to update task. Please try again.')
    }
  }

  const deleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      await fetchTasks() // Refresh the task list
    } catch (err) {
      console.error('Error deleting task:', err)
      setError('Failed to delete task. Please try again.')
    }
  }

  const clearFilter = () => {
    setFilterStatus('all')
  }

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'completed') return task.completed
    if (filterStatus === 'pending') return !task.completed
    return true
  })

  const completedCount = tasks.filter(t => t.completed).length
  const pendingCount = tasks.filter(t => !t.completed).length

  return (
    <ErrorBoundary>
      <div className={cn("space-y-6", "container mx-auto px-4 py-8")}>
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Todo App</h1>
          <p className="text-muted-foreground mt-2">
            Manage your tasks efficiently
          </p>
        </header>

        {/* Create Task Form */}
        <TaskForm
          onSubmit={createTask}
          isLoading={isCreating}
        />

        {/* Filter Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filter Tasks</h2>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Total: {tasks.length}</span>
              {filterStatus === 'all' && (
                <>
                  <span>•</span>
                  <span>Completed: {completedCount}</span>
                  <span>•</span>
                  <span>Pending: {pendingCount}</span>
                </>
              )}
            </div>
          </div>
          <TaskFilters
            currentFilter={filterStatus}
            onFilterChange={setFilterStatus}
          />
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {loading ? (
            // Loading state
            <div className="space-y-4">
              <LoadingSkeleton.TaskForm />
              <LoadingSkeleton.Filter />
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton.TaskCard key={i} />
              ))}
            </div>
          ) : error ? (
            // Error state
            <Card className="p-6 text-center">
              <div className="text-red-500">{error}</div>
              <Button
                onClick={fetchTasks}
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </Card>
          ) : filteredTasks.length === 0 ? (
            // Empty states
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <NoTasksEmptyState
                  onCreateTask={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                />
              ) : (
                <NoFilteredTasksEmptyState
                  filter={filterStatus}
                  onClearFilter={clearFilter}
                  onCreateTask={() => {
                    setFilterStatus('all')
                    document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                />
              )}
            </div>
          ) : (
            // Task list
            <div className="space-y-4">
              {filterStatus === 'completed' && completedCount === tasks.length && tasks.length > 0 && (
                <AllTasksCompletedEmptyState
                  onCreateTask={() => setFilterStatus('pending')}
                />
              )}

              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskCompletion}
                  onDelete={deleteTask}
                  className="animate-fade-in"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}