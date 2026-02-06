'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuth } from './auth-provider'
import { usePermissions } from './auth-provider'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string | string[]
  requiredPermissions?: string[]
  fallback?: React.ReactNode
  redirectTo?: string
  showUnauthorized?: boolean
  showLoading?: boolean
  className?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermissions = [],
  fallback,
  redirectTo = '/login',
  showUnauthorized = true,
  showLoading = true,
  className,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth()
  const { hasAllPermissions } = usePermissions(requiredPermissions)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true)

      // Wait for auth to initialize
      if (isAuthLoading) {
        const checkInterval = setInterval(() => {
          if (!isAuthLoading) {
            clearInterval(checkInterval)
            checkAccess()
          }
        }, 100)
        return
      }

      // Check authentication
      if (!isAuthenticated) {
        if (redirectTo) {
          router.push(redirectTo)
        }
        setIsChecking(false)
        return
      }

      // Check role permissions
      if (requiredRole) {
        const userRole = user?.role
        if (!userRole) {
          setIsChecking(false)
          return
        }

        const hasRole = Array.isArray(requiredRole)
          ? requiredRole.includes(userRole)
          : requiredRole === userRole

        if (!hasRole) {
          if (showUnauthorized) {
            setIsChecking(false)
            return
          } else {
            router.push('/unauthorized')
          }
        }
      }

      // Check permissions
      if (requiredPermissions.length > 0) {
        if (!hasAllPermissions()) {
          if (showUnauthorized) {
            setIsChecking(false)
            return
          } else {
            router.push('/unauthorized')
          }
        }
      }

      setIsChecking(false)
    }

    checkAccess()
  }, [
    isAuthenticated,
    isAuthLoading,
    user,
    requiredRole,
    requiredPermissions,
    hasAllPermissions,
    router,
    redirectTo,
    showUnauthorized,
  ])

  // Show loading state
  if (isChecking || isAuthLoading) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center', className)}>
        <LoadingSpinner size="lg" text="Checking access..." />
      </div>
    )
  }

  // Show unauthorized fallback
  if (showUnauthorized && !isAuthenticated) {
    return (
      <UnauthorizedFallback
        redirectTo={redirectTo}
        className={className}
      />
    )
  }

  // Show role-based unauthorized
  if (requiredRole) {
    const userRole = user?.role
    const hasRole = Array.isArray(requiredRole)
      ? requiredRole.includes(userRole)
      : requiredRole === userRole

    if (!hasRole) {
      return (
        <RoleUnauthorizedFallback
          requiredRole={requiredRole}
          userRole={userRole}
          className={className}
        />
      )
    }
  }

  // Show permission-based unauthorized
  if (requiredPermissions.length > 0 && !hasAllPermissions()) {
    return (
      <PermissionUnauthorizedFallback
        requiredPermissions={requiredPermissions}
        className={className}
      />
    )
  }

  // Return children if all checks pass
  return <>{children}</>
}

// Unauthorized fallback component
function UnauthorizedFallback({
  redirectTo,
  className
}: {
  redirectTo: string
  className?: string
}) {
  const handleLogin = () => {
    window.location.href = redirectTo
  }

  return (
    <div className={cn('min-h-screen flex items-center justify-center p-4', className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <CardTitle className="text-2xl font-bold">Access Required</CardTitle>
          <CardDescription>
            Please sign in to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleLogin} className="w-full">
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Role unauthorized fallback component
function RoleUnauthorizedFallback({
  requiredRole,
  userRole,
  className,
}: {
  requiredRole: string | string[]
  userRole?: string
  className?: string
}) {
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

  return (
    <div className={cn('min-h-screen flex items-center justify-center p-4', className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription>
            You don't have the required role to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              Required Role:
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {requiredRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {userRole && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Your Role:
              </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {userRole}
              </span>
            </div>
          )}

          <div className="pt-4">
            <p className="text-sm text-gray-600">
              Please contact your administrator if you believe this is an error.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Permission unauthorized fallback component
function PermissionUnauthorizedFallback({
  requiredPermissions,
  className,
}: {
  requiredPermissions: string[]
  className?: string
}) {
  return (
    <div className={cn('min-h-screen flex items-center justify-center p-4', className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription>
            You don't have the required permissions to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              Required Permissions:
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {requiredPermissions.map((permission) => (
                <span
                  key={permission}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-600">
              Please contact your administrator if you believe this is an error.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Higher-order component for route protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Hook for checking if a route is accessible
export function useIsRouteAccessible({
  requiredRole,
  requiredPermissions = [],
}: {
  requiredRole?: string | string[]
  requiredPermissions?: string[]
} = {}) {
  const { isAuthenticated, user } = useAuth()
  const { hasAllPermissions } = usePermissions(requiredPermissions)

  const isAccessible = React.useMemo(() => {
    if (!isAuthenticated) return false

    // Check role
    if (requiredRole) {
      const userRole = user?.role
      if (!userRole) return false

      const hasRole = Array.isArray(requiredRole)
        ? requiredRole.includes(userRole)
        : requiredRole === userRole

      if (!hasRole) return false
    }

    // Check permissions
    if (requiredPermissions.length > 0) {
      if (!hasAllPermissions()) return false
    }

    return true
  }, [isAuthenticated, user, requiredRole, requiredPermissions, hasAllPermissions])

  return { isAccessible }
}

// Example usage patterns:

/*
1. Basic route protection
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

2. Role-based protection
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

3. Multiple roles allowed
<ProtectedRoute requiredRole={['admin', 'manager']}>
  <ManagementDashboard />
</ProtectedRoute>

4. Permission-based protection
<ProtectedRoute requiredPermissions={['read:reports', 'write:reports']}>
  <ReportsPage />
</ProtectedRoute>

5. Combined role and permission protection
<ProtectedRoute
  requiredRole="admin"
  requiredPermissions={['manage:users']}
>
  <UserManagement />
</ProtectedRoute>

6. Using HOC
const AdminDashboard = withAuth(AdminDashboardComponent, {
  requiredRole: 'admin',
  redirectTo: '/admin-login'
})

7. Using hook
function MyComponent() {
  const { isAccessible } = useIsRouteAccessible({
    requiredRole: 'premium',
    requiredPermissions: ['view:premium-content']
  })

  if (!isAccessible) {
    return <UpgradePlan />
  }

  return <PremiumContent />
}
*/