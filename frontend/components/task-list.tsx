'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { apiClient, Task } from '@/lib/api'
import { TaskStatus } from '@/types'

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<TaskStatus>('all')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getTasks(filterStatus)
      setTasks(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch tasks')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus])

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
      fetchTasks()
    } catch (err) {
      setError('Failed to create task')
      console.error(err)
    }
  }

  const toggleTaskCompletion = async (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        await apiClient.updateTask(taskId, {
          completed: !task.completed,
        })
        fetchTasks()
      }
    } catch (err) {
      setError('Failed to update task')
      console.error(err)
    }
  }

  const deleteTask = async (taskId: number) => {
    try {
      await apiClient.deleteTask(taskId)
      fetchTasks()
    } catch (err) {
      setError('Failed to delete task')
      console.error(err)
    }
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
            <Button type="submit" disabled={!newTaskTitle.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <div className="flex gap-2">
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
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                    />
                    <div className="flex-1">
                      <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm text-muted-foreground mt-1 ${task.completed ? 'line-through' : ''}`}>
                          {task.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(task.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
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