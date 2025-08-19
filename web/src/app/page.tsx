"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/useAuth'
import { todoAPI } from '@/services/api'
import type { Todo } from '@/types'
import { cn, formatRelativeTime } from '@/lib/utils'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  useEffect(() => {
    const load = async () => {
      try {
        const { todos } = await todoAPI.getAll()
        setTodos(todos)
      } catch {}
    }
    if (user) load()
  }, [user])

  if (loading || !user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Hello, {user.username}</h1>
      <form className="flex gap-2 mb-4" onSubmit={async (e) => {
        e.preventDefault()
        if (!title.trim()) return
        const { todo } = await todoAPI.create({ title: title.trim() })
        setTodos([todo, ...todos])
        setTitle('')
      }}>
        <input className="input flex-1" placeholder="Add a task" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>

      <div className="space-y-2">
        {todos.map(t => (
          <div key={t.id} className="card">
            <div className="card-content flex items-center justify-between">
              <div>
                <div className={cn('font-medium', t.completed && 'line-through text-muted-foreground')}>{t.title}</div>
                <div className="text-xs text-muted-foreground">{formatRelativeTime(t.created_at)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost" onClick={async () => {
                  const { todo } = await todoAPI.update(t.id, { completed: !t.completed })
                  setTodos(prev => prev.map(p => p.id === t.id ? todo : p))
                }}>{t.completed ? 'Undo' : 'Done'}</button>
                <button className="btn btn-ghost text-destructive" onClick={async () => {
                  await todoAPI.delete(t.id)
                  setTodos(prev => prev.filter(p => p.id !== t.id))
                }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
