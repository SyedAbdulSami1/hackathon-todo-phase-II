import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Plus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline'
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className
}: EmptyStateProps) {
  const defaultIcon = (
    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
      <CheckCircle className="w-8 h-8 text-blue-600" />
    </div>
  )

  return (
    <Card className={cn("text-center py-12", className)}>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex-shrink-0">
            {icon || defaultIcon}
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-semibold text-foreground">
              {title}
            </h3>
            {description && (
              <p className="text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="mt-4 transition-all duration-200 hover:scale-105"
            >
              {action.label}
              {action.label.includes('Create') && (
                <Plus className="w-4 h-4 ml-2" />
              )}
              {action.label.includes('Get') && (
                <ArrowRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Specific empty states for the todo app
export function NoTasksEmptyState({
  onCreateTask,
  className
}: {
  onCreateTask: () => void
  className?: string
}) {
  return (
    <EmptyState
      title="No tasks found"
      description="Create your first task to get started with tracking your work."
      icon={
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Plus className="w-8 h-8 text-green-600" />
        </div>
      }
      action={{
        label: "Create Your First Task",
        onClick: onCreateTask,
        variant: "default"
      }}
      className={className}
    />
  )
}

export function AllTasksCompletedEmptyState({
  onCreateTask,
  className
}: {
  onCreateTask: () => void
  className?: string
}) {
  return (
    <EmptyState
      title="All tasks completed! 🎉"
      description="Great job! You've completed all your tasks. Create a new one to keep going."
      icon={
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-purple-600" />
        </div>
      }
      action={{
        label: "Create New Task",
        onClick: onCreateTask,
        variant: "default"
      }}
      className={className}
    />
  )
}

export function NoFilteredTasksEmptyState({
  filter,
  onClearFilter,
  onCreateTask,
  className
}: {
  filter: string
  onClearFilter: () => void
  onCreateTask: () => void
  className?: string
}) {
  const getFilterMessage = () => {
    switch (filter) {
      case 'pending':
        return "You don't have any pending tasks."
      case 'completed':
        return "You don't have any completed tasks yet."
      default:
        return "No tasks match your current filter."
    }
  }

  return (
    <EmptyState
      title={getFilterMessage()}
      description={
        filter === 'completed'
          ? "Complete some tasks to see them here."
          : "Try creating a new task or clear the filter."
      }
      icon={
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-gray-400" />
        </div>
      }
      actions={[
        {
          label: "Create New Task",
          onClick: onCreateTask,
          variant: "default"
        },
        {
          label: "Clear Filter",
          onClick: onClearFilter,
          variant: "outline"
        }
      ]}
      className={className}
    />
  )
}