import { TaskList } from '@/components/task-list'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Todo App</h1>
        <p className="text-muted-foreground mt-2">Manage your tasks efficiently</p>
      </header>
      <TaskList />
    </div>
  )
}