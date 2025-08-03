'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db/mongodb'
import { Editor } from '@/lib/db/models'
import { cookies } from 'next/headers'

export async function signIn(email: string, password: string) {
  try {
    await dbConnect()

    const editor = await Editor.findOne({ 
      email,
      is_deleted: false 
    }).lean()

    if (!editor) {
      return { error: 'Invalid credentials' }
    }

    const isPasswordValid = await bcrypt.compare(password, editor.password)

    if (!isPasswordValid) {
      return { error: 'Invalid credentials' }
    }

    // Create a simple session identifier
    const sessionId = `${editor._id.toString()}-${Date.now()}`
    
    // Set cookie with user data
    const cookieStore = await cookies()
    cookieStore.set('auth-session', JSON.stringify({
      id: editor._id.toString(),
      email: editor.email,
      name: editor.fullname,
      sessionId
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    })

  } catch (error) {
    console.error('Sign in error:', error)
    return { error: 'Something went wrong' }
  }
  
  redirect('/admin')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-session')
  redirect('/admin/login')
}