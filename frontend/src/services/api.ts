import axios from 'axios'
import type { User, Todo, Address, AuthResponse } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: async (data: { username: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/users/me')
    return response.data
  },
}

// Todo API
export const todoAPI = {
  getAll: async (): Promise<{ todos: Todo[] }> => {
    const response = await api.get('/todos')
    return response.data
  },

  create: async (data: { title: string; description?: string }): Promise<{ todo: Todo }> => {
    const response = await api.post('/todos', data)
    return response.data
  },

  update: async (id: number, data: { title?: string; description?: string; completed?: boolean }): Promise<{ todo: Todo }> => {
    const response = await api.put(`/todos/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/todos/${id}`)
    return response.data
  },
}

// Address API
export const addressAPI = {
  getAll: async (): Promise<{ addresses: Address[] }> => {
    const response = await api.get('/addresses')
    return response.data
  },

  create: async (data: { city: string; country: string; street: string; pincode?: string }): Promise<{ address: Address }> => {
    const response = await api.post('/addresses', data)
    return response.data
  },
}

export default api
