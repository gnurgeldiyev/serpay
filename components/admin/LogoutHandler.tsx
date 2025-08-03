'use client'

import { useEffect } from 'react'
import { logout } from '@/app/actions/auth'

export function LogoutHandler() {
  useEffect(() => {
    logout()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Çykyş edilýär...</p>
    </div>
  )
}