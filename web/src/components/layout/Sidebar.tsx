"use client"
import { useState } from 'react'
import { useAuth } from '@/contexts/useAuth'
import { Home, CheckSquare, Settings, LogOut, Plus, ChevronDown, Menu, X, User } from 'lucide-react'
import Link from 'next/link'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)

  const nav = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'Todos', icon: CheckSquare, href: '/' },
    { name: 'Profile', icon: User, href: '/' },
    { name: 'Settings', icon: Settings, href: '/' },
  ]

  return (
    <>
      <div className="lg:hidden fixed top-3 left-3 z-40">
        <button onClick={() => setOpen(!open)} className="btn btn-ghost p-2">{open ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}</button>
      </div>

      <div className={`lg:hidden fixed inset-0 z-30 bg-black/40 transition ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 left-0 w-64 bg-card border-r transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="font-semibold">Notionize</h1>
              <button onClick={() => setOpen(false)} className="btn btn-ghost p-2"><X className="h-5 w-5"/></button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {nav.map(i => (
                <Link key={i.name} href={i.href} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent">
                  <i.icon className="h-5 w-5"/>
                  {i.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full grid place-items-center text-primary-foreground">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{user?.username}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                </div>
                <button onClick={logout} className="btn btn-ghost p-2 ml-auto"><LogOut className="h-4 w-4"/></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:border-r bg-card ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && <h1 className="font-semibold">Notionize</h1>}
          <button onClick={() => setCollapsed(!collapsed)} className="btn btn-ghost p-1">
            <ChevronDown className={`h-4 w-4 transition ${collapsed ? 'rotate-180' : ''}`}/>
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(i => (
            <Link key={i.name} href={i.href} className="group flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent">
              <i.icon className="h-5 w-5"/>
              {!collapsed && <span>{i.name}</span>}
            </Link>
          ))}
        </nav>
        {!collapsed && (
          <div className="p-4 border-t">
            <button className="btn btn-primary w-full"><Plus className="h-4 w-4 mr-2"/>New Todo</button>
          </div>
        )}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full grid place-items-center text-primary-foreground">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{user?.username}</div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
              </div>
            )}
            <button onClick={logout} className="btn btn-ghost p-2 ml-auto" title="Logout"><LogOut className="h-4 w-4"/></button>
          </div>
        </div>
      </aside>
      <div className="hidden lg:block lg:w-64"/>
    </>
  )
}


