import React from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = 'lg',
  padding = 'md'
}: ResponsiveContainerProps) {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm':
        return 'max-w-sm'
      case 'md':
        return 'max-w-md'
      case 'lg':
        return 'max-w-4xl'
      case 'xl':
        return 'max-w-6xl'
      case '2xl':
        return 'max-w-7xl'
      case 'full':
        return 'max-w-full'
      default:
        return 'max-w-4xl'
    }
  }

  const getPaddingClass = () => {
    switch (padding) {
      case 'none':
        return ''
      case 'sm':
        return 'px-4 py-6'
      case 'md':
        return 'px-6 py-8'
      case 'lg':
        return 'px-8 py-12'
      default:
        return 'px-6 py-8'
    }
  }

  return (
    <div className={cn(
      'mx-auto w-full',
      getMaxWidthClass(),
      getPaddingClass(),
      className
    )}>
      {children}
    </div>
  )
}

// Grid layout component for task lists
interface GridLayoutProps {
  children: React.ReactNode
  className?: string
  columns?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
  }
  gap?: 'sm' | 'md' | 'lg'
}

export function GridLayout({
  children,
  className,
  columns = { default: 1, sm: 1, md: 2, lg: 3 },
  gap = 'md'
}: GridLayoutProps) {
  const getGridClass = () => {
    const gapClasses = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6'
    }

    const columnClasses = [
      `grid-cols-${columns.default}`,
      columns.sm && `sm:grid-cols-${columns.sm}`,
      columns.md && `md:grid-cols-${columns.md}`,
      columns.lg && `lg:grid-cols-${columns.lg}`
    ].filter(Boolean).join(' ')

    return cn('grid', gapClasses[gap], columnClasses)
  }

  return (
    <div className={cn(getGridClass(), className)}>
      {children}
    </div>
  )
}

// Flex layout component
interface FlexLayoutProps {
  children: React.ReactNode
  className?: string
  direction?: 'row' | 'col'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

export function FlexLayout({
  children,
  className,
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = 'nowrap',
  gap = 'md'
}: FlexLayoutProps) {
  const getDirectionClass = () => {
    switch (direction) {
      case 'row':
        return 'flex-row'
      case 'col':
        return 'flex-col'
      default:
        return 'flex-row'
    }
  }

  const getAlignClass = () => {
    switch (align) {
      case 'start':
        return 'items-start'
      case 'center':
        return 'items-center'
      case 'end':
        return 'items-end'
      case 'stretch':
        return 'items-stretch'
      default:
        return 'items-start'
    }
  }

  const getJustifyClass = () => {
    switch (justify) {
      case 'start':
        return 'justify-start'
      case 'center':
        return 'justify-center'
      case 'end':
        return 'justify-end'
      case 'between':
        return 'justify-between'
      case 'around':
        return 'justify-around'
      case 'evenly':
        return 'justify-evenly'
      default:
        return 'justify-start'
    }
  }

  const getGapClass = () => {
    switch (gap) {
      case 'sm':
        return 'gap-2'
      case 'md':
        return 'gap-4'
      case 'lg':
        return 'gap-6'
      case 'xl':
        return 'gap-8'
      default:
        return 'gap-4'
    }
  }

  return (
    <div className={cn(
      'flex',
      getDirectionClass(),
      getAlignClass(),
      getJustifyClass(),
      wrap !== 'nowrap' && `flex-${wrap}`,
      getGapClass(),
      className
    )}>
      {children}
    </div>
  )
}