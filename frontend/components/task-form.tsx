'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { apiClient, CreateTaskRequest } from '@/lib/api'

interface TaskFormProps {
  onTaskCreated?: () => void
  className?: string
}

export function TaskForm({ onTaskCreated, className = '' }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setLoading(true)
      setError(null)

      await apiClient.createTask({
        title: title.trim(),
        description: description.trim() || undefined,
      } as CreateTaskRequest)

      setTitle('')
      setDescription('')
      onTaskCreated?.()
    } catch (err) {
      setError('Failed to create task')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
        <CardDescription>Create a new task to track your work</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Task title (required)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              disabled={loading}
            />
            {title.length > 0 && title.length > 200 && (
              <p className="text-sm text-red-500 mt-1">
                Title must be less than 200 characters
              </p>
            )}
          </div>
          <div>
            <Input
              placeholder="Task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              disabled={loading}
            />
            {description.length > 0 && description.length > 1000 && (
              <p className="text-sm text-red-500 mt-1">
                Description must be less than 1000 characters
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={!title.trim() || loading}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            {loading ? 'Creating...' : 'Add Task'}
          </Button>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}