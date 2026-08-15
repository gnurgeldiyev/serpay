import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import gurbannazarUrlAliases from './data/migrations/gurbannazar-ezizow-url-aliases.json'

const POET_POEM_PATH = '/p/gurbannazar-ezizow/'
const gurbannazarLegacyRedirects = new Map(
  gurbannazarUrlAliases.flatMap(({ url, aliases }) => (
    aliases.map((alias) => [alias.normalize('NFC'), url] as const)
  )),
)

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith(POET_POEM_PATH)) {
    const requestedUrl = decodeURIComponent(
      request.nextUrl.pathname.slice(POET_POEM_PATH.length),
    ).normalize('NFC')
    const canonicalUrl = gurbannazarLegacyRedirects.get(requestedUrl)
    if (canonicalUrl) {
      const destination = request.nextUrl.clone()
      destination.pathname = `${POET_POEM_PATH}${canonicalUrl}`
      return NextResponse.redirect(destination, 308)
    }
  }

  // Skip proxy for login page to prevent loops
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
  matcher: [
    '/admin/:path*',
    '/p/gurbannazar-ezizow/:poemUrl',
  ]
}
