'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/db/mongodb'
import { Poem, Poet } from '@/lib/db/models'
import { auth } from '@/lib/auth-wrapper'

export async function deletePoem(poemId: string) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    // Soft delete the poem
    await Poem.findByIdAndUpdate(poemId, {
      is_deleted: true,
      updated_at: new Date()
    })
    
    revalidatePath('/admin/poems')
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Delete poem error:', error)
    return { success: false, error: 'Failed to delete poem' }
  }
}

export async function createPoem(formData: FormData) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    const poetId = formData.get('poetId') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    
    // Generate URL from title
    const url = title
      .toLowerCase()
      .replace(/[^a-zçäöüýňşž0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    const data = {
      title,
      url,
      content,
      author: poetId,
      created_by: session.id,
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: { $ne: true }
    }
    
    // Check if URL already exists for this poet
    const poet = await Poet.findById(poetId)
    if (!poet) {
      return { success: false, error: 'Şahyr tapylmady' }
    }
    
    const existingPoem = await Poem.findOne({ 
      url: data.url, 
      author: poetId,
      is_deleted: { $ne: true } 
    })
    
    if (existingPoem) {
      return { success: false, error: 'Bu goşgy eýýäm bar' }
    }
    
    await Poem.create(data)
    
    revalidatePath('/admin/poems')
    revalidatePath('/')
    revalidatePath(`/p/${encodeURIComponent(poet.url)}`)
  } catch (error) {
    console.error('Create poem error:', error)
    return { success: false, error: 'Failed to create poem' }
  }
  
  redirect('/admin/poems')
}

export async function updatePoem(poemId: string, formData: FormData) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    const poetId = formData.get('poetId') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    
    // Generate URL from title
    const url = title
      .toLowerCase()
      .replace(/[^a-zçäöüýňşž0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    const data = {
      title,
      url,
      content,
      author: poetId,
      updated_at: new Date()
    }
    
    // Check if URL already exists for this poet (excluding current poem)
    const existingPoem = await Poem.findOne({ 
      url: data.url, 
      author: poetId,
      is_deleted: { $ne: true },
      _id: { $ne: poemId }
    })
    
    if (existingPoem) {
      return { success: false, error: 'Bu goşgy eýýäm bar' }
    }
    
    // Get both old and new poet info for revalidation
    const oldPoem = await Poem.findById(poemId).populate('author').lean()
    await Poem.findByIdAndUpdate(poemId, data)
    const newPoet = await Poet.findById(poetId).lean()
    
    revalidatePath('/admin/poems')
    revalidatePath(`/admin/poems/${poemId}/edit`)
    revalidatePath('/')
    
    // Revalidate both old and new poet pages with encoded URLs
    if (oldPoem && oldPoem.author && typeof oldPoem.author === 'object' && 'url' in oldPoem.author) {
      const authorUrl = (oldPoem.author as any).url
      if (typeof authorUrl === 'string') {
        revalidatePath(`/p/${encodeURIComponent(authorUrl)}`)
      }
    }
    if (newPoet) {
      revalidatePath(`/p/${encodeURIComponent(newPoet.url)}`)
      revalidatePath(`/p/${encodeURIComponent(newPoet.url)}/${encodeURIComponent(url)}`)
    }
    
    return { success: true, message: 'Goşgy üstünlikli üýtgedildi' }
  } catch (error) {
    console.error('Update poem error:', error)
    return { success: false, error: 'Goşgy üýtgetmekde säwlik ýüze çykdy' }
  }
}

export async function createPoemForPoet(poetId: string, formData: FormData) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    
    // Generate URL from title
    const url = title
      .toLowerCase()
      .replace(/[^a-zçäöüýňşž0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    const data = {
      title,
      url,
      content,
      author: poetId,
      created_by: session.id,
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: { $ne: true }
    }
    
    // Check if poet exists
    const poet = await Poet.findById(poetId)
    if (!poet || poet.is_deleted) {
      return { success: false, error: 'Şahyr tapylmady' }
    }
    
    // Check if URL already exists for this poet
    const existingPoem = await Poem.findOne({ 
      url: data.url, 
      author: poetId,
      is_deleted: { $ne: true } 
    })
    
    if (existingPoem) {
      return { success: false, error: 'Bu goşgy eýýäm bar' }
    }
    
    await Poem.create(data)
    
    revalidatePath(`/admin/poets/${poetId}/poems`)
    revalidatePath('/admin/poems')
    revalidatePath('/')
    revalidatePath(`/p/${encodeURIComponent(poet.url)}`)
  } catch (error) {
    console.error('Create poem for poet error:', error)
    return { success: false, error: 'Failed to create poem' }
  }
  
  redirect(`/admin/poets/${poetId}/poems`)
}

export async function updatePoemForPoet(poetId: string, poemId: string, formData: FormData) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    
    // Generate URL from title
    const url = title
      .toLowerCase()
      .replace(/[^a-zçäöüýňşž0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    const data = {
      title,
      url,
      content,
      updated_at: new Date()
    }
    
    // Check if URL already exists for this poet (excluding current poem)
    const existingPoem = await Poem.findOne({ 
      url: data.url, 
      author: poetId,
      is_deleted: { $ne: true },
      _id: { $ne: poemId }
    })
    
    if (existingPoem) {
      return { success: false, error: 'Bu goşgy eýýäm bar' }
    }
    
    // Verify poem belongs to this poet
    const poem = await Poem.findOne({ _id: poemId, author: poetId })
    if (!poem) {
      return { success: false, error: 'Goşgy tapylmady' }
    }
    
    await Poem.findByIdAndUpdate(poemId, data)
    
    const poet = await Poet.findById(poetId)
    
    revalidatePath(`/admin/poets/${poetId}/poems`)
    revalidatePath('/admin/poems')
    revalidatePath('/')
    if (poet) {
      revalidatePath(`/p/${encodeURIComponent(poet.url)}`)
      revalidatePath(`/p/${encodeURIComponent(poet.url)}/${encodeURIComponent(url)}`)
    }
    
    return { success: true, message: 'Goşgy üstünlikli üýtgedildi' }
  } catch (error) {
    console.error('Update poem for poet error:', error)
    return { success: false, error: 'Goşgy üýtgetmekde säwlik ýüze çykdy' }
  }
}

export async function deletePoemForPoet(poetId: string, poemId: string) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    // Verify poem belongs to this poet
    const poem = await Poem.findOne({ _id: poemId, author: poetId })
    if (!poem) {
      return { success: false, error: 'Goşgy tapylmady' }
    }
    
    // Soft delete the poem
    await Poem.findByIdAndUpdate(poemId, {
      is_deleted: true,
      updated_at: new Date()
    })
    
    const poet = await Poet.findById(poetId)
    
    revalidatePath(`/admin/poets/${poetId}/poems`)
    revalidatePath('/admin/poems')
    revalidatePath('/')
    if (poet) {
      revalidatePath(`/p/${encodeURIComponent(poet.url)}`)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Delete poem for poet error:', error)
    return { success: false, error: 'Failed to delete poem' }
  }
}

export async function bulkDeletePoems(poetId: string, poemIds: string[]) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await dbConnect()
    
    // Verify all poems belong to this poet
    const poems = await Poem.find({ 
      _id: { $in: poemIds }, 
      poet: poetId 
    })
    
    if (poems.length !== poemIds.length) {
      return { success: false, error: 'Käbir goşgular tapylmady' }
    }
    
    // Soft delete all poems
    await Poem.updateMany(
      { _id: { $in: poemIds } },
      { 
        is_deleted: true,
        updated_at: new Date()
      }
    )
    
    const poet = await Poet.findById(poetId)
    
    revalidatePath(`/admin/poets/${poetId}/poems`)
    revalidatePath('/admin/poems')
    revalidatePath('/')
    if (poet) {
      revalidatePath(`/p/${encodeURIComponent(poet.url)}`)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Bulk delete poems error:', error)
    return { success: false, error: 'Failed to delete poems' }
  }
}