export interface User {
  id: number
  username: string
  email: string
  age?: number
  created_at: string
}

export interface Todo {
  id: number
  title: string
  description?: string
  completed: boolean
  created_at: string
  updated_at?: string
  user_id: number
}

export interface Address {
  id: number
  user_id: number
  city: string
  country: string
  street: string
  pincode?: string
  created_at: string
}

export interface AuthResponse {
  user: User
  token: string
}


