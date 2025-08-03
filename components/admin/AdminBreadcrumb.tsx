'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface Breadcrumb {
  name: string
  href?: string
}

export function AdminBreadcrumb() {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): Breadcrumb[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: Breadcrumb[] = []
    
    // Skip 'admin' from paths but keep it in the URL building
    const adminIndex = paths.indexOf('admin')
    if (adminIndex > -1) {
      paths.splice(adminIndex, 1)
    }
    
    // Build breadcrumbs
    let currentPath = '/admin'
    
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      
      // Format the name
      let name = path
      
      // Handle special cases
      switch (path) {
        case 'poets':
          name = 'Şahyrlar'
          break
        case 'poems':
          name = 'Goşgular'
          break
        case 'editors':
          name = 'Redaktorlar'
          break
        case 'new':
          name = 'Täze'
          break
        case 'edit':
          name = 'Üýtget'
          break
        default:
          // For IDs, try to get a better name from the page
          if (path.match(/^[a-f0-9]{24}$/)) {
            name = '...'
          }
      }
      
      breadcrumbs.push({
        name,
        href: index === paths.length - 1 ? undefined : currentPath
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  if (breadcrumbs.length === 0) return null
  
  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link 
        href="/admin" 
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {breadcrumb.href ? (
            <Link 
              href={breadcrumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {breadcrumb.name}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{breadcrumb.name}</span>
          )}
        </div>
      ))}
    </nav>
  )
}