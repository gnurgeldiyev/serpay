import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem } from '@/lib/db/models'
import { PoetPoemsSearch } from '@/components/admin/PoetPoemsSearch'
import { PoetPoemsTable } from '@/components/admin/PoetPoemsTable'

async function getPoetWithPoems(id: string, searchQuery?: string) {
  await dbConnect()
  
  const poet = await Poet.findById(id).lean()
  if (!poet || poet.is_deleted) {
    notFound()
  }
  
  const query: any = { 
    author: id, 
    is_deleted: { $ne: true } 
  }
  
  // Add search filter if query exists
  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: 'i' }
  }
  
  const poems = await Poem.find(query).sort({ created_at: -1 }).lean()
  
  return {
    poet: {
      id: poet._id.toString(),
      fullname: poet.fullname,
      url: poet.url
    },
    poems: poems.map(poem => ({
      id: poem._id.toString(),
      title: poem.title,
      url: poem.url,
      created_at: poem.created_at.toISOString()
    }))
  }
}

export default async function PoetPoemsPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { id } = await params
  const { q } = await searchParams
  const { poet, poems } = await getPoetWithPoems(id, q)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/poets"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{poet.fullname}</h1>
          <p className="text-muted-foreground">Goşgulary dolandyr</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Goşgular ({poems.length})</h2>
          {q && (
            <span className="text-sm text-muted-foreground">
              "{q}" üçin gözleg netijeleri
            </span>
          )}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <PoetPoemsSearch poetId={id} />
          <Link
            href={`/admin/poets/${id}/poems/new`}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Täze goşgy
          </Link>
        </div>
      </div>

      <PoetPoemsTable 
        poetId={id}
        poetUrl={poet.url}
        poems={poems}
      />
    </div>
  )
}