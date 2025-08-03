import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem } from '@/lib/db/models'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    await dbConnect()

    // Create regex for case-insensitive search
    const searchRegex = new RegExp(query, 'i')

    // Search poets and poems in parallel
    const [poets, poems] = await Promise.all([
      Poet.find({
        fullname: searchRegex,
        is_deleted: { $ne: true }
      })
      .limit(5)
      .select('fullname url')
      .lean(),
      
      Poem.find({
        title: searchRegex,
        is_deleted: { $ne: true }
      })
      .populate('author', 'fullname')
      .limit(5)
      .select('title url author')
      .lean()
    ])

    // Format results
    const results = [
      ...poets.map(poet => ({
        id: poet._id.toString(),
        title: poet.fullname,
        type: 'poet' as const,
        url: `/admin/poets/${poet._id}/edit`
      })),
      ...poems.map(poem => ({
        id: poem._id.toString(),
        title: poem.title,
        subtitle: (poem.author && typeof poem.author === 'object' && 'fullname' in poem.author) 
          ? String(poem.author.fullname) 
          : 'Näbelli',
        type: 'poem' as const,
        url: `/admin/poems/${poem._id}/edit`
      }))
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}