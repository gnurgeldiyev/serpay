import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import { Poem } from '@/lib/db/models'

const MAX_RESULTS = 12

type PopulatedAuthor = {
  fullname: string
  url: string
  slug?: string
  is_deleted?: boolean
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Strip Tiptap/HTML markup to a single-line plain-text string. */
function toPlainText(html?: string | null): string {
  return (html || '')
    .replace(/<\s*br\s*\/?\s*>/gi, ' ')
    .replace(/<\/(p|div|h[1-6]|li|blockquote)\s*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** A short context window around the first match of `query` within the content. */
function buildSnippet(html: string | null | undefined, query: string): string {
  const text = toPlainText(html)
  if (!text) return ''
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) {
    return text.length > 160 ? text.slice(0, 160).trimEnd() + '…' : text
  }
  const start = Math.max(0, idx - 60)
  const end = Math.min(text.length, idx + query.length + 90)
  return (
    (start > 0 ? '…' : '') +
    text.slice(start, end).trim() +
    (end < text.length ? '…' : '')
  )
}

export async function GET(request: NextRequest) {
  try {
    const q = (request.nextUrl.searchParams.get('q') || '').trim()
    if (q.length < 2) {
      return NextResponse.json({ results: [] })
    }

    await dbConnect()

    const rx = new RegExp(escapeRegex(q), 'i')
    const select = 'title url slug year author content'
    const authorFields = 'fullname url slug is_deleted'

    // Optional scope to a single poet (e.g. the poet page search).
    const poet = request.nextUrl.searchParams.get('poet')
    const base: Record<string, unknown> = { is_deleted: { $ne: true } }
    if (poet && /^[a-f0-9]{24}$/i.test(poet)) base.author = poet

    // 1) Title matches take priority.
    const titleMatches = await Poem.find({ ...base, title: rx })
      .populate('author', authorFields)
      .select(select)
      .limit(MAX_RESULTS)
      .lean()

    // 2) Fill remaining slots with content matches (excluding title hits).
    const remaining = MAX_RESULTS - titleMatches.length
    const contentMatches = remaining > 0
      ? await Poem.find({
          ...base,
          content: rx,
          _id: { $nin: titleMatches.map((p) => p._id) }
        })
        .populate('author', authorFields)
        .select(select)
        .limit(remaining)
        .lean()
      : []

    const toResult = (poem: (typeof titleMatches)[number], matchedIn: 'title' | 'content') => {
      const author = (poem.author && typeof poem.author === 'object'
        ? (poem.author as unknown as PopulatedAuthor)
        : null)
      if (!author || author.is_deleted) return null

      const poetUrl = author.slug || author.url
      const poemUrl = poem.slug || poem.url

      return {
        id: poem._id.toString(),
        title: poem.title,
        poetName: author.fullname,
        year: poem.year || undefined,
        href: `/p/${poetUrl}/${poemUrl}`,
        matchedIn,
        snippet: buildSnippet(poem.content, matchedIn === 'content' ? q : '')
      }
    }

    const results = [
      ...titleMatches.map((p) => toResult(p, 'title')),
      ...contentMatches.map((p) => toResult(p, 'content'))
    ].filter(Boolean)

    return NextResponse.json(
      { results },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    )
  } catch (error) {
    console.error('Poem search error:', error)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
