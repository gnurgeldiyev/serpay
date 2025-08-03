'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db/mongodb'
import { Editor } from '@/lib/db/models'
import { auth } from '@/lib/auth-wrapper'
import { cookies } from 'next/headers'

export async function deleteEditor(editorId: string) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    // Check if user is trying to delete themselves
    const deletedSelf = session.id === editorId
    
    // Check if this is the last editor
    const editorCount = await Editor.countDocuments({ is_deleted: false })
    if (editorCount <= 1) {
      return { success: false, error: 'Iň soňky redaktory pozmak bolmaýar' }
    }
    
    // Soft delete the editor
    await Editor.findByIdAndUpdate(editorId, {
      is_deleted: true,
      updated_at: new Date()
    })
    
    // If user deleted themselves, clear their session
    if (deletedSelf) {
      const cookieStore = await cookies()
      cookieStore.delete('auth-session')
    }
    
    revalidatePath('/admin/editors')
    
    return { success: true, deletedSelf }
  } catch (error) {
    console.error('Delete editor error:', error)
    return { success: false, error: 'Failed to delete editor' }
  }
}

export async function createEditor(formData: FormData) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    const fullname = formData.get('fullname') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // Check if email already exists
    const existingEditor = await Editor.findOne({ email, is_deleted: false })
    if (existingEditor) {
      return { success: false, error: 'Bu email eýýäm ulanylýar' }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const data = {
      fullname,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false
    }
    
    await Editor.create(data)
    
    revalidatePath('/admin/editors')
  } catch (error) {
    console.error('Create editor error:', error)
    return { success: false, error: 'Failed to create editor' }
  }
  
  redirect('/admin/editors')
}

export async function updateEditor(editorId: string, formData: FormData) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    const fullname = formData.get('fullname') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // Check if email already exists (excluding current editor)
    const existingEditor = await Editor.findOne({ 
      email, 
      is_deleted: false,
      _id: { $ne: editorId }
    })
    if (existingEditor) {
      return { success: false, error: 'Bu email eýýäm ulanylýar' }
    }
    
    const updateData: any = {
      fullname,
      email,
      updated_at: new Date()
    }
    
    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }
    
    await Editor.findByIdAndUpdate(editorId, updateData)
    
    revalidatePath('/admin/editors')
    revalidatePath(`/admin/editors/${editorId}/edit`)
  } catch (error) {
    console.error('Update editor error:', error)
    return { success: false, error: 'Failed to update editor' }
  }
  
  redirect('/admin/editors')
}