import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem } from '@/lib/db/models'

const SITE_URL = 'https://serpay.penjire.com'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
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
  
  // Generate sitemap XML
  const urls: string[] = []
  
  // Homepage
  urls.push(`  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`)
  
  // Static pages
  const staticPages = [
    { path: '/about', changefreq: 'monthly', priority: '0.8' },
    { path: '/contact', changefreq: 'yearly', priority: '0.5' }
  ]
  
  staticPages.forEach(page => {
    urls.push(`  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  })
  
  // Poet pages
  poets.forEach(poet => {
    urls.push(`  <url>
    <loc>${SITE_URL}/p/${escapeXml(poet.url)}</loc>
    <lastmod>${(poet.updated_at || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
  })
  
  // Poem pages
  poems.forEach(poem => {
    const poetUrl = poem.author && typeof poem.author === 'object' && 'url' in poem.author
      ? String(poem.author.url)
      : ''
    
    if (poetUrl && typeof poem.url === 'string') {
      urls.push(`  <url>
    <loc>${SITE_URL}/p/${escapeXml(poetUrl)}/${escapeXml(poem.url)}</loc>
    <lastmod>${(poem.updated_at || new Date()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
    }
  })
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
  
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}