import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Poet from '@/lib/db/models/poet'
import Poem from '@/lib/db/models/poem'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ poetUrl: string }> }
) {
  try {
    await dbConnect()
    
    const { poetUrl } = await params
    
    const poet = await Poet.findOne({ url: poetUrl, is_deleted: false }).lean()
    
    if (!poet) {
      return NextResponse.json({ error: 'Poet not found' }, { status: 404 })
    }
    
    const poems = await Poem.find({ 
      author: poet._id, 
      is_approved: true 
    })
    .sort({ created_at: -1 })
    .lean()
    
    const poetData = {
      id: poet._id.toString(),
      fullname: poet.fullname,
      url: poet.url,
      birth_date: poet.birth_date,
      death_date: poet.death_date,
      bio: poet.bio,
      wiki_link: poet.wiki_link,
      avatar: poet.avatar,
      created_at: poet.created_at,
      poems: poems.map(poem => ({
        id: poem._id.toString(),
        title: poem.title,
        url: poem.url,
        year: poem.year,
        content: poem.content,
        created_at: poem.created_at
      }))
    }
    
    return NextResponse.json(poetData)
  } catch (error) {
    console.error('Error fetching poet:', error)
    return NextResponse.json({ error: 'Failed to fetch poet' }, { status: 500 })
  }
}