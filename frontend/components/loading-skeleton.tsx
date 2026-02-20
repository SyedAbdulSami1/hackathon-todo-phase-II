import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function TaskCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-5 h-5 bg-gray-300 rounded" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-full" />
              <div className="h-3 bg-gray-300 rounded w-5/6" />
            </div>
            <div className="flex space-x-4 text-xs">
              <div className="h-3 bg-gray-300 rounded w-20" />
              <div className="h-3 bg-gray-300 rounded w-20" />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded" />
            <div className="w-8 h-8 bg-gray-300 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TaskFormSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-24" />
            <div className="h-10 bg-gray-300 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32" />
            <div className="h-24 bg-gray-300 rounded" />
          </div>
          <div className="h-10 bg-gray-300 rounded w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function FilterSkeleton() {
  return (
    <div className="flex space-x-2 animate-pulse">
      <div className="h-10 bg-gray-300 rounded w-24" />
      <div className="h-10 bg-gray-300 rounded w-24" />
      <div className="h-10 bg-gray-300 rounded w-28" />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-300 rounded w-48" />
      <TaskFormSkeleton />
      <FilterSkeleton />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// Export LoadingSkeleton object with sub-components to match expected usage
export const LoadingSkeleton = {
  TaskCard: TaskCardSkeleton,
  TaskForm: TaskFormSkeleton,
  Filter: FilterSkeleton,
  Page: PageSkeleton
}