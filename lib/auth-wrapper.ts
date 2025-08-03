import { cookies } from 'next/headers'

export async function auth() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('auth-session')

  if (!sessionCookie) return null

  try {
    const session = JSON.parse(sessionCookie.value)
    return session
  } catch {
    return null
  }
}