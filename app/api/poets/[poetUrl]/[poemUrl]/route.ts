import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Poet from '@/lib/db/models/poet'
import Poem from '@/lib/db/models/poem'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ poetUrl: string; poemUrl: string }> }
) {
  try {
    await dbConnect()
    
    const { poetUrl, poemUrl } = await params
    
    // Decode the URL parameters
    const decodedPoetUrl = decodeURIComponent(poetUrl)
    const decodedPoemUrl = decodeURIComponent(poemUrl)
    
    const poet = await Poet.findOne({ url: decodedPoetUrl, is_deleted: false }).lean()
    
    if (!poet) {
      return NextResponse.json({ error: 'Poet not found' }, { status: 404 })
    }
    
    const poem = await Poem.findOne({ 
      author: poet._id,
      url: decodedPoemUrl,
      is_approved: true 
    }).lean()
    
    if (!poem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 })
    }
    
    const poemData = {
      id: poem._id.toString(),
      title: poem.title,
      url: poem.url,
      content: poem.content,
      year: poem.year,
      notes: poem.notes,
      youtube_link: poem.youtube_link,
      category: poem.category,
      created_at: poem.created_at,
      author: {
        id: poet._id.toString(),
        fullname: poet.fullname,
        url: poet.url,
        avatar: poet.avatar
      }
    }
    
    return NextResponse.json(poemData)
  } catch (error) {
    console.error('Error fetching poem:', error)
    return NextResponse.json({ error: 'Failed to fetch poem' }, { status: 500 })
  }
}