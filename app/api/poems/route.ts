import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Poem from '@/lib/db/models/poem'
import Poet from '@/lib/db/models/poet'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    
    const poems = await Poem.find({ is_approved: true })
      .populate('author', 'fullname url avatar')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await Poem.countDocuments({ is_approved: true })
    
    return NextResponse.json({
      poems: poems.map(poem => ({
        id: poem._id.toString(),
        title: poem.title,
        url: poem.url,
        content: poem.content,
        year: poem.year,
        author: poem.author,
        created_at: poem.created_at
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching poems:', error)
    return NextResponse.json({ error: 'Failed to fetch poems' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    // TODO: Check authentication and get editor ID
    const editorId = 'temp-editor-id' // Replace with actual editor ID from auth
    
    const poem = await Poem.create({
      title: body.title,
      url: body.url,
      author: body.author,
      year: body.year,
      content: body.content,
      notes: body.notes,
      youtube_link: body.youtube_link,
      category: body.category,
      added_by: editorId,
      is_approved: false // New poems need approval
    })
    
    return NextResponse.json({ 
      message: 'Poem created successfully', 
      id: (poem as any)._id.toString() 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating poem:', error)
    return NextResponse.json({ error: 'Failed to create poem' }, { status: 500 })
  }
}