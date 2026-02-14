'use client'

import { Button } from '@/components/ui/button'
import { TaskStatus } from '@/types'
import { Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskFiltersProps {
  currentFilter: TaskStatus
  onFilterChange: (filter: TaskStatus) => void
  className?: string
}

const statusOptions = [
  { value: 'all' as TaskStatus, label: 'All Tasks', count: 0 },
  { value: 'pending' as TaskStatus, label: 'Pending', count: 0 },
  { value: 'completed' as TaskStatus, label: 'Completed', count: 0 }
] as const

export function TaskFilters({
  currentFilter,
  onFilterChange,
  className
}: TaskFiltersProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {statusOptions.map((option) => (
        <Button
          key={option.value}
          variant={currentFilter === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(option.value)}
          className={cn(
            "transition-all duration-200",
            currentFilter === option.value
              ? "shadow-md"
              : "hover:bg-gray-50"
          )}
          aria-pressed={currentFilter === option.value}
          aria-label={`Show ${option.label}`}
        >
          <span className="capitalize">{option.label}</span>
          {option.count > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-white/20 rounded-full">
              {option.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  )
}

// Component for the filter section with title
export function FilterSection({
  currentFilter,
  onFilterChange,
  className
}: TaskFiltersProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Filter Tasks</h3>
      </div>
      <TaskFilters
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
      />
    </div>
  )
}