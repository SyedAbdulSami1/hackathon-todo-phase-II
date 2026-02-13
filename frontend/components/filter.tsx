'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Filter as FilterIcon } from 'lucide-react'
import { TaskStatus } from '@/types'

interface FilterProps {
  status: TaskStatus
  onStatusChange: (status: TaskStatus) => void
  className?: string
}

export function Filter({ status, onStatusChange, className = '' }: FilterProps) {
  const statusOptions = [
    { value: 'all' as TaskStatus, label: 'All Tasks' },
    { value: 'pending' as TaskStatus, label: 'Pending' },
    { value: 'completed' as TaskStatus, label: 'Completed' },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5" />
          Filter Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={status === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange(option.value)}
              className="capitalize"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}