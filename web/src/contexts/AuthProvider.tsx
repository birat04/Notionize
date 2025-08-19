"use client"
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/types'
import { authAPI } from '@/services/api'
import toast from 'react-hot-toast'
import { AuthContext, type AuthContextType } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (token && savedUser) {
        try {
          const { user: currentUser } = await authAPI.getCurrentUser()
          setUser(currentUser)
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { user: loggedInUser, token } = await authAPI.login({ email, password })
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(loggedInUser))
      setUser(loggedInUser)
      toast.success('Successfully logged in!')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Login failed'
      toast.error(msg)
      throw e
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const { user: registeredUser, token } = await authAPI.register({ username, email, password })
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(registeredUser))
      setUser(registeredUser)
      toast.success('Account created successfully!')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Registration failed'
      toast.error(msg)
      throw e
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const value: AuthContextType = { user, loading, login, register, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


