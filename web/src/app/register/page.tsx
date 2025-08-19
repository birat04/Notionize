"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/useAuth'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(username, email, password)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Create account</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input className="input w-full" value={username} onChange={(e) => setUsername(e.target.value)} minLength={3} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="input w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input className="input w-full pr-10" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Password must be at least 6 characters long</p>
          </div>
          <button disabled={loading} className="btn btn-primary w-full" type="submit">
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}


