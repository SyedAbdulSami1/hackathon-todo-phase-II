'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, AlertCircle, CheckCircle } from 'lucide-react'
import { CreateTaskRequest } from '@/types'
import { cn } from '@/lib/utils'

interface TaskFormProps {
  onSubmit: (data: CreateTaskRequest) => Promise<void>
  className?: string
  isLoading?: boolean
}

export function TaskForm({ onSubmit, className, isLoading = false }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSuccess(false)

    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined
      })

      // Reset form
      setFormData({ title: '', description: '' })
      setErrors({})
      setSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add New Task</span>
        </CardTitle>
        <CardDescription>
          Create a new task to track your work
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="task-title" className="text-sm font-medium">
              Task Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="task-title"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={isSubmitting}
              maxLength={200}
              className={cn(
                errors.title && "border-red-500 focus:border-red-500",
                success && "border-green-500 focus:border-green-500"
              )}
            />
            {errors.title && (
              <div className="flex items-center space-x-1 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.title}</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              {formData.title.length}/200 characters
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="task-description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              id="task-description"
              placeholder="Enter task description..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isSubmitting}
              maxLength={1000}
              rows={3}
              className={cn(
                errors.description && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.description && (
              <div className="flex items-center space-x-1 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.description}</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              {formData.description.length}/1000 characters
            </div>
          </div>

          <Button
            type="submit"
            disabled={!formData.title.trim() || isSubmitting}
            className="w-full transition-all duration-200 hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </>
            )}
          </Button>

          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">Task created successfully!</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}