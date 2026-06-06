import { MetadataRoute } from 'next'

const SITE_URL = 'https://serpay.penjire.com'

export default function robots(): MetadataRoute.Robots {
  // A single wildcard group allows every crawler — including AI agents
  // (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended,
  // Applebot-Extended, CCBot, …) — while keeping admin/api out of indexes.
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
