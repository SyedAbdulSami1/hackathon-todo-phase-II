'use client'

import { useState, useEffect } from 'react'
import { useAuth, useAuthState } from '@/components/auth-provider'
import { ProtectedRoute, withAuth } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  User,
  LogOut,
  Settings,
  Bell,
  Shield,
  Calendar,
  BarChart3,
  FileText,
  Users,
  Mail,
  Phone,
  MapPin,
  Building
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

// Dashboard content component
function DashboardContent() {
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to your dashboard',
      message: 'Get started by creating your first task',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      title: 'Security update',
      message: 'Please verify your email address',
      time: '1 hour ago',
      read: false,
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Task Manager</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h2>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your tasks today.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +2 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                2 high priority
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Due today
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>
                  Stay updated with your account activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        notification.read
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-500 block" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Profile */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-lg">
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{user?.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {user?.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{user?.email}</span>
                  </div>

                  {user?.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{user?.phone}</span>
                    </div>
                  )}

                  {user?.company && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{user?.company}</span>
                    </div>
                  )}

                  {user?.location && (
                    <div className="flex items-center space-x-3 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{user?.location}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Edit Profile
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Two-Factor Auth</span>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Password Change</span>
                  <span className="text-sm text-gray-600">3 months ago</span>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <a href="/security">
                    Update Security Settings
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

// Protected dashboard page
export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole={['user', 'admin']}>
      <DashboardContent />
    </ProtectedRoute>
  )
}

// Example of using withAuth HOC
const AdminDashboard = withAuth(function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>
              This page is only accessible to admin users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Welcome to the admin dashboard!</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}, {
  requiredRole: 'admin',
  redirectTo: '/dashboard'
})

// Example of checking permissions in component
function UserManagement() {
  const { hasAllPermissions } = usePermissions(['manage:users'])

  if (!hasAllPermissions()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have permission to manage users.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to the user management panel!</p>
      </CardContent>
    </Card>
  )
}

// Component to check authentication state
function AuthStatusIndicator() {
  const { isAuthenticated, isLoading, user } = useAuthState()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">You are not signed in.</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded">
      <p className="text-sm text-green-800">
        Welcome, {user?.name}! You are signed in as {user?.role}.
      </p>
    </div>
  )
}