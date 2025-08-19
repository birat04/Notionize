"use client"
import { useState } from 'react'
import { useAuth } from '@/contexts/useAuth'
import { Search, Bell, Settings } from 'lucide-react'

export default function Header() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/70 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost p-2"><Bell className="h-5 w-5" /></button>
          <button className="btn btn-ghost p-2"><Settings className="h-5 w-5" /></button>
          <div className="hidden sm:flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-medium">{user?.username}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full grid place-items-center text-primary-foreground">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}


