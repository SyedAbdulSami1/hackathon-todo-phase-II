'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Trash2, CheckCircle2, Circle, Edit2, Save, X, AlertCircle, Loader2 } from 'lucide-react'
import { apiClient, Task, getApiError } from '@/lib/api'
import { TaskStatus } from '@/types'

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<TaskStatus>('all')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [submittingTask, setSubmittingTask] = useState<number | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [filterStatus])

  // Auto-refresh tasks every 30 seconds when user is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchTasks()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [filterStatus])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getTasks(filterStatus)
      setTasks(response)
      setError(null)
    } catch (err) {
      setError(getApiError(err))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    try {
      await apiClient.createTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
      })

      setNewTaskTitle('')
      setNewTaskDescription('')
      setError(null)
      fetchTasks()
    } catch (err) {
      setError(getApiError(err))
      console.error(err)
    }
  }

  const toggleTaskCompletion = async (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        await apiClient.updateTask(taskId, {
          status: task.status === 'completed' ? 'pending' : 'completed',
        })
        setError(null)
        fetchTasks()
      }
    } catch (err) {
      setError(getApiError(err))
      console.error(err)
    }
  }

  const deleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    setSubmittingTask(taskId)
    try {
      await apiClient.deleteTask(taskId)
      setError(null)
      fetchTasks()
    } catch (err) {
      setError(getApiError(err))
      console.error(err)
    } finally {
      setSubmittingTask(null)
    }
  }

  const startEditing = (task: Task) => {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setError(null)
  }

  const cancelEditing = () => {
    setEditingTask(null)
    setEditTitle('')
    setEditDescription('')
  }

  const saveEdit = async () => {
    if (!editingTask || !editTitle.trim()) return

    try {
      await apiClient.updateTask(editingTask.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      })
      cancelEditing()
      fetchTasks()
    } catch (err) {
      setError(getApiError(err))
      console.error(err)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const filteredTasks = tasks

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="ml-4 h-6 w-6 p-0"
            >
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Create Task Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
          <CardDescription>Create a new task to track your work</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createTask} className="space-y-4">
            <div>
              <Input
                placeholder="Task title (required)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
                maxLength={200}
              />
            </div>
            <div>
              <Input
                placeholder="Task description (optional)"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                maxLength={1000}
              />
            </div>
            <Button type="submit" disabled={!newTaskTitle.trim()} className="w-full">
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('all')}
          size="sm"
        >
          All Tasks
        </Button>
        <Button
          variant={filterStatus === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('pending')}
          size="sm"
        >
          Pending
        </Button>
        <Button
          variant={filterStatus === 'in_progress' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('in_progress')}
          size="sm"
        >
          In Progress
        </Button>
        <Button
          variant={filterStatus === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('completed')}
          size="sm"
        >
          Completed
        </Button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No tasks found. Create your first task above!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                    />
                    <div className="flex-1">
                      {editingTask?.id === task.id ? (
                        <div className="space-y-3">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Task title"
                            maxLength={200}
                            className="font-medium"
                          />
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Task description"
                            maxLength={1000}
                          />
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(task.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <>
                          <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`text-sm text-muted-foreground mt-1 ${task.status === 'completed' ? 'line-through' : ''}`}>
                              {task.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Created: {new Date(task.created_at).toLocaleDateString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingTask?.id === task.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={saveEdit}
                        >
                          <Save className="w-5 h-5 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={cancelEditing}
                        >
                          <X className="w-5 h-5 text-red-500" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleTaskCompletion(task.id)}
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(task)}
                        >
                          <Edit2 className="w-5 h-5 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                          disabled={submittingTask === task.id}
                        >
                          {submittingTask === task.id ? (
                            <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5 text-red-500" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}