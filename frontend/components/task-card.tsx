'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  Clock
} from 'lucide-react'
import { Task } from '@/lib/api'
import { TaskStatus } from '@/types'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onToggleComplete: (taskId: number) => void
  onDelete: (taskId: number) => void
  className?: string
}

export function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  className
}: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'in_progress':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <Circle className="w-5 h-5 text-muted-foreground" />
    )
  }

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all duration-200",
        task.completed && "opacity-75",
        className
      )}
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            />
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "font-medium text-lg mb-1",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={cn(
                    "text-sm text-muted-foreground mb-2",
                    task.completed && "line-through"
                  )}
                >
                  {task.description}
                </p>
              )}
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Created: {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
                {task.updated_at !== task.created_at && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      Updated: {new Date(task.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleComplete(task.id)}
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              className="hover:bg-green-100"
            >
              {getStatusIcon(task.completed)}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
              className="hover:bg-red-100 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}