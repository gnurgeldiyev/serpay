'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  Users, 
  BookOpen, 
  UserCog,
  Plus,
  Search,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AdminSearch } from './AdminSearch'

const navigation = [
  { 
    name: 'Esasy sahypa', 
    href: '/admin', 
    icon: Home,
    exact: true 
  },
  { 
    name: 'Şahyrlar', 
    href: '/admin/poets', 
    icon: Users,
    actions: [
      { name: 'Täze şahyr', href: '/admin/poets/new', icon: Plus }
    ]
  },
  { 
    name: 'Goşgular', 
    href: '/admin/poems', 
    icon: BookOpen,
    actions: [
      { name: 'Täze goşgy', href: '/admin/poems/new', icon: Plus }
    ]
  },
  { 
    name: 'Redaktorlar', 
    href: '/admin/editors', 
    icon: UserCog,
    actions: [
      { name: 'Täze redaktor', href: '/admin/editors/new', icon: Plus }
    ]
  }
]

interface AdminSidebarProps {
  userName?: string
}

export function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-background/80 backdrop-blur-lg border lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-full w-72 bg-background/80 backdrop-blur-xl border-r transform transition-transform lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="px-6 py-6 border-b">
            <Link href="/admin" className="block">
              <h2 className="text-2xl font-[family-name:var(--font-inria-serif-bold)]">
                Serpaý Admin
              </h2>
            </Link>
          </div>

          {/* Search */}
          <div className="px-4 py-4 border-b">
            <AdminSearch />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href, item.exact)
                const expanded = expandedItem === item.name

                return (
                  <li key={item.name}>
                    <div className="relative">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          active 
                            ? "bg-primary text-primary-foreground" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                      
                      {item.actions && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            setExpandedItem(expanded ? null : item.name)
                          }}
                          className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted/50",
                            active && "hover:bg-primary-foreground/10"
                          )}
                        >
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-transform",
                            expanded && "rotate-90"
                          )} />
                        </button>
                      )}
                    </div>

                    {/* Sub-actions */}
                    {item.actions && expanded && (
                      <ul className="ml-7 mt-1 space-y-1">
                        {item.actions.map((action) => (
                          <li key={action.href}>
                            <Link
                              href={action.href}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <action.icon className="h-3 w-3" />
                              {action.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <div className="text-sm">
                <p className="font-medium">{userName || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">Redaktor</p>
              </div>
              <Link
                href="/admin/logout"
                className="p-2 text-muted-foreground hover:text-foreground"
                title="Çyk"
              >
                <LogOut className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}