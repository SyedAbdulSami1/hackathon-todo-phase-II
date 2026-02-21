'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: undefined,
    errorInfo: undefined
  })

  useEffect(() => {
    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
      setErrorState({
        hasError: true,
        error,
        errorInfo
      })
    }

    const originalError = console.error
    console.error = (...args) => {
      handleError(args[0] as Error, {
        componentStack: '',
        ...args[1]
      } as React.ErrorInfo)
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  if (errorState.hasError) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Oops! Something went wrong
                </h2>
                <p className="text-muted-foreground">
                  We&apos;re sorry, but an unexpected error has occurred.
                </p>
              </div>

              <div className="space-y-2 w-full">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full transition-all duration-200 hover:scale-[1.02]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && errorState.error && (
                <details className="mt-4 text-left w-full">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded-md text-xs font-mono overflow-auto max-h-32">
                    <div className="text-red-600 font-semibold">
                      {errorState.error.name}: {errorState.error.message}
                    </div>
                    {errorState.error.stack && (
                      <div className="mt-1 text-gray-700">
                        {errorState.error.stack}
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}