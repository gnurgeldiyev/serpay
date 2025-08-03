'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem } from '@/lib/db/models'
import { auth } from '@/lib/auth-wrapper'

export async function deletePoet(poetId: string) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    // Soft delete the poet
    await Poet.findByIdAndUpdate(poetId, {
      is_deleted: true,
      updated_at: new Date()
    })
    
    // Also soft delete all poems by this poet
    await Poem.updateMany(
      { poet: poetId },
      { is_deleted: true, updated_at: new Date() }
    )
    
    revalidatePath('/admin/poets')
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Delete poet error:', error)
    return { success: false, error: 'Failed to delete poet' }
  }
}

export async function createPoet(formData: FormData) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    const data = {
      fullname: formData.get('fullname') as string,
      url: formData.get('url') as string,
      birth_date: formData.get('birth_date') as string || undefined,
      death_date: formData.get('death_date') as string || undefined,
      avatar: formData.get('avatar') as string || undefined,
      created_by: session.id,
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false
    }
    
    // Check if URL already exists
    const existingPoet = await Poet.findOne({ url: data.url, is_deleted: false })
    if (existingPoet) {
      return { success: false, error: 'Bu URL eýýäm ulanylýar' }
    }
    
    await Poet.create(data)
    
    revalidatePath('/admin/poets')
    revalidatePath('/')
  } catch (error) {
    console.error('Create poet error:', error)
    return { success: false, error: 'Failed to create poet' }
  }
  
  redirect('/admin/poets')
}

export async function updatePoet(poetId: string, formData: FormData) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    const data = {
      fullname: formData.get('fullname') as string,
      url: formData.get('url') as string,
      birth_date: formData.get('birth_date') as string || undefined,
      death_date: formData.get('death_date') as string || undefined,
      avatar: formData.get('avatar') as string || undefined,
      updated_at: new Date()
    }
    
    // Check if URL already exists (excluding current poet)
    const existingPoet = await Poet.findOne({ 
      url: data.url, 
      is_deleted: false,
      _id: { $ne: poetId }
    })
    if (existingPoet) {
      return { success: false, error: 'Bu URL eýýäm ulanylýar' }
    }
    
    await Poet.findByIdAndUpdate(poetId, data)
    
    revalidatePath('/admin/poets')
    revalidatePath(`/admin/poets/${poetId}/edit`)
    revalidatePath('/')
    revalidatePath(`/p/${encodeURIComponent(data.url)}`)
  } catch (error) {
    console.error('Update poet error:', error)
    return { success: false, error: 'Failed to update poet' }
  }
  
  redirect('/admin/poets')
}