import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip middleware for login page to prevent loops
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check for auth cookie on admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authSession = request.cookies.get('auth-session')
    
    if (!authSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}