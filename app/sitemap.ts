import { MetadataRoute } from 'next'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem } from '@/lib/db/models'

const SITE_URL = 'https://serpay.penjire.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect()
  
  // Get all poets
  const poets = await Poet.find({ 
    is_deleted: { $ne: true } 
  })
  .select('url updated_at')
  .lean()
  
  // Get all poems with their poets
  const poems = await Poem.find({ 
    is_deleted: { $ne: true },
    is_approved: true
  })
  .populate('author', 'url')
  .select('url updated_at author')
  .lean()
  
  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]
  
  // Poet pages
  const poetPages = poets.map(poet => ({
    url: `${SITE_URL}/p/${poet.url}`,
    lastModified: poet.updated_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // Poem pages
  const poemPages = poems.map(poem => {
    const poetUrl = poem.author && typeof poem.author === 'object' && 'url' in poem.author
      ? poem.author.url
      : ''
    
    return {
      url: `${SITE_URL}/p/${poetUrl}/${poem.url}`,
      lastModified: poem.updated_at || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  }).filter(page => page.url.includes('/p/')) // Filter out poems without valid poet URLs
  
  return [...staticPages, ...poetPages, ...poemPages]
}