'use client'

import { useState, useEffect } from 'react'
import { TaskList } from '@/components/task-list'
import { AuthForms } from '@/components/auth-forms'
import { authClient, User } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(authClient.isAuthenticated())
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (loggedIn) {
      const fetchUser = async () => {
        const currentUser = await authClient.getCurrentUser()
        setUser(currentUser)
      }
      fetchUser()
    }
  }, [loggedIn])

  const handleLogout = () => {
    authClient.logout()
    setLoggedIn(false)
    setUser(null)
  }

  if (!loggedIn) {
    return <AuthForms onSuccess={() => setLoggedIn(true)} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Todo App</h1>
          {user && <p className="text-muted-foreground mt-2">Welcome, {user.username}!</p>}
        </div>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </header>
      <TaskList />
    </div>
  )
}