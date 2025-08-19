import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { todoAPI } from '../services/api'
import type { Todo } from '../types'
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Trash2, 
  Edit3, 
  Calendar,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react'
import { cn, formatRelativeTime } from '../lib/utils'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      const { todos } = await todoAPI.getAll()
      setTodos(todos)
    } catch (error) {
      toast.error('Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoTitle.trim()) return

    try {
      const { todo } = await todoAPI.create({ title: newTodoTitle.trim() })
      setTodos([todo, ...todos])
      setNewTodoTitle('')
      toast.success('Todo added successfully')
    } catch (error) {
      toast.error('Failed to add todo')
    }
  }

  const toggleTodo = async (todo: Todo) => {
    try {
      const { todo: updatedTodo } = await todoAPI.update(todo.id, {
        completed: !todo.completed
      })
      setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t))
      toast.success(updatedTodo.completed ? 'Todo completed!' : 'Todo uncompleted')
    } catch (error) {
      toast.error('Failed to update todo')
    }
  }

  const updateTodo = async (todo: Todo) => {
    if (!editTitle.trim()) return

    try {
      const { todo: updatedTodo } = await todoAPI.update(todo.id, {
        title: editTitle.trim()
      })
      setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t))
      setEditingTodo(null)
      setEditTitle('')
      toast.success('Todo updated successfully')
    } catch (error) {
      toast.error('Failed to update todo')
    }
  }

  const deleteTodo = async (todoId: number) => {
    try {
      await todoAPI.delete(todoId)
      setTodos(todos.filter(t => t.id !== todoId))
      toast.success('Todo deleted successfully')
    } catch (error) {
      toast.error('Failed to delete todo')
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo)
    setEditTitle(todo.title)
  }

  const cancelEditing = () => {
    setEditingTodo(null)
    setEditTitle('')
  }

  const completedTodos = todos.filter(todo => todo.completed)
  const pendingTodos = todos.filter(todo => !todo.completed)
  const completionRate = todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Tasks</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{todos.length}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{completedTodos.length}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{pendingTodos.length}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Completion Rate</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Add new todo */}
      <div className="card">
        <div className="card-content">
          <form onSubmit={addTodo} className="flex space-x-2">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Add a new task..."
              className="input flex-1"
            />
            <button type="submit" className="btn btn-primary">
              <Plus className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Todos list */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Your Tasks</h2>
        
        {todos.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
              <p className="text-muted-foreground">
                Start by adding your first task above!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <div key={todo.id} className="card">
                <div className="card-content">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTodo(todo)}
                      className="flex-shrink-0"
                    >
                      {todo.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      {editingTodo?.id === todo.id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="input"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateTodo(todo)
                            if (e.key === 'Escape') cancelEditing()
                          }}
                          autoFocus
                        />
                      ) : (
                        <p className={cn(
                          "text-foreground",
                          todo.completed && "line-through text-muted-foreground"
                        )}>
                          {todo.title}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(todo.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {editingTodo?.id === todo.id ? (
                        <>
                          <button
                            onClick={() => updateTodo(todo)}
                            className="btn btn-ghost p-1 text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="btn btn-ghost p-1 text-muted-foreground hover:text-foreground"
                          >
                            <Circle className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(todo)}
                            className="btn btn-ghost p-1 text-muted-foreground hover:text-foreground"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="btn btn-ghost p-1 text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
