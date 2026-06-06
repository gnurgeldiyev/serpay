import { MetadataRoute } from 'next'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem } from '@/lib/db/models'

const SITE_URL = 'https://serpay.penjire.com'

export const revalidate = 86400 // Revalidate once per day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect()
  
  // Get all poets
  const poets = await Poet.find({
    is_deleted: { $ne: true }
  })
  .select('url slug updated_at')
  .lean()

  // Get all poems with their poets. Match the public pages, which list every
  // non-deleted poem (they do not filter on is_approved), so the sitemap
  // mirrors exactly what is reachable and indexable on the site.
  const poems = await Poem.find({
    is_deleted: { $ne: true }
  })
  .populate('author', 'url slug')
  .select('url slug updated_at author')
  .lean()

  // Static pages (only routes that actually exist)
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]
  
  // Poet pages
  const poetPages = poets.map(poet => ({
    url: `${SITE_URL}/p/${poet.slug || poet.url}`,
    lastModified: poet.updated_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Poem pages
  const poemPages = poems.map(poem => {
    const author = poem.author && typeof poem.author === 'object' ? poem.author as { url?: string; slug?: string } : null
    const poetUrl = author ? (author.slug || author.url || '') : ''

    return {
      url: `${SITE_URL}/p/${poetUrl}/${poem.slug || poem.url}`,
      lastModified: poem.updated_at || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  }).filter(page => page.url.includes('/p/')) // Filter out poems without valid poet URLs
  
  return [...staticPages, ...poetPages, ...poemPages]
}