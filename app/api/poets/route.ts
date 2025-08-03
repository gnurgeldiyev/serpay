import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodb'
import Poet from '@/lib/db/models/poet'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const poets = await Poet.find({ is_deleted: false })
      .sort({ fullname: 1 })
      .lean()

    const poetsPublic = poets.map(poet => ({
      id: poet._id.toString(),
      fullname: poet.fullname,
      url: poet.url,
      birth_date: poet.birth_date,
      death_date: poet.death_date,
      bio: poet.bio,
      wiki_link: poet.wiki_link,
      avatar: poet.avatar,
      created_at: poet.created_at
    }))

    return NextResponse.json(poetsPublic)
  } catch (error) {
    console.error('Error fetching poets:', error)
    return NextResponse.json({ error: 'Failed to fetch poets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    const poet = await Poet.create({
      fullname: body.fullname,
      url: body.url,
      birth_date: body.birth_date,
      death_date: body.death_date,
      bio: body.bio,
      wiki_link: body.wiki_link,
      avatar: body.avatar
    })
    
    return NextResponse.json(poet.toPublic(), { status: 201 })
  } catch (error) {
    console.error('Error creating poet:', error)
    return NextResponse.json({ error: 'Failed to create poet' }, { status: 500 })
  }
}