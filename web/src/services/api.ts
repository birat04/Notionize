import axios from 'axios'
import type { User, Todo, AuthResponse, Address } from '@/types'

const api = axios.create({
  baseURL: '', 
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: async (data: { username: string; email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post('/api/auth/register', data)
    return res.data
  },
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post('/api/auth/login', data)
    return res.data
  },
  getCurrentUser: async (): Promise<{ user: User }> => {
    const res = await api.get('/api/users/me')
    return res.data
  },
}

export const todoAPI = {
  getAll: async (): Promise<{ todos: Todo[] }> => {
    const res = await api.get('/api/todos')
    return res.data
  },
  create: async (data: { title: string; description?: string }): Promise<{ todo: Todo }> => {
    const res = await api.post('/api/todos', data)
    return res.data
  },
  update: async (id: number, data: Partial<Todo>): Promise<{ todo: Todo }> => {
    const res = await api.put(`/api/todos/${id}`, data)
    return res.data
  },
  delete: async (id: number): Promise<{ message: string }> => {
    const res = await api.delete(`/api/todos/${id}`)
    return res.data
  },
}

export default api


