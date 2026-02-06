import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'secondary'
  className?: string
  text?: string
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  const variantClasses = {
    default: 'border-gray-300 border-t-blue-600',
    primary: 'border-blue-300 border-t-blue-600',
    secondary: 'border-gray-300 border-t-gray-600',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2',
          sizeClasses[size],
          variantClasses[variant],
        )}
      />
      {text && (
        <span className={cn(
          'ml-2 text-sm font-medium',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base',
          size === 'xl' && 'text-lg',
        )}>
          {text}
        </span>
      )}
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  className?: string
  blur?: boolean
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  className,
  blur = true,
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm',
        blur && 'backdrop-blur-sm',
        className,
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" variant="primary" />
        <p className="text-gray-600 text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines = 3 }: SkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-gray-200 rounded',
            i === lines - 1 ? 'w-5/6' : 'w-full',
            className,
          )}
          style={{ height: i === 0 ? '20px' : '16px' }}
        />
      ))}
    </div>
  )
}

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = 'Loading page...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="xl" variant="primary" />
        <p className="text-gray-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  )
}

interface InlineLoadingProps {
  size?: 'sm' | 'md'
  className?: string
}

export function InlineLoading({ size = 'sm', className }: InlineLoadingProps) {
  return (
    <LoadingSpinner
      size={size}
      className={cn('inline-block', className)}
    />
  )
}

// Loading states for different components
export const LoadingStates = {
  Button: ({ isLoading, children, className }: { isLoading: boolean; children: React.ReactNode; className?: string }) => (
    <div className={cn('relative', className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <span className={cn(isLoading && 'opacity-0')}>{children}</span>
    </div>
  ),

  Card: ({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) => (
    <div className="relative">
      {isLoading && <LoadingOverlay isLoading={message: 'Loading...'} />}
      {children}
    </div>
  ),
}