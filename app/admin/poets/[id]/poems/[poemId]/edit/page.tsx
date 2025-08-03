import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/db/mongodb'
import { Poem, Poet } from '@/lib/db/models'
import { updatePoemForPoet } from '@/app/actions/poems'
import { PoemForm } from '@/components/admin/PoemForm'

async function getPoemWithPoet(poetId: string, poemId: string) {
  await dbConnect()
  
  const poet = await Poet.findById(poetId).lean()
  if (!poet || poet.is_deleted) {
    notFound()
  }
  
  const poem = await Poem.findOne({
    _id: poemId,
    author: poetId,
    is_deleted: { $ne: true }
  }).lean()
  
  if (!poem) {
    notFound()
  }
  
  return {
    poet: {
      id: poet._id.toString(),
      fullname: poet.fullname,
      url: poet.url
    },
    poem: {
      id: poem._id.toString(),
      title: poem.title,
      content: poem.content
    }
  }
}

export default async function EditPoemForPoetPage({ 
  params 
}: { 
  params: Promise<{ id: string; poemId: string }> 
}) {
  const { id: poetId, poemId } = await params
  const { poet, poem } = await getPoemWithPoet(poetId, poemId)
  
  // Bind both IDs to the updatePoemForPoet action
  const updatePoemWithIds = updatePoemForPoet.bind(null, poetId, poemId)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/admin/poets/${poetId}/poems`}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Goşgyny üýtget</h1>
          <p className="text-muted-foreground">{poet.fullname}</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <PoemForm
          action={updatePoemWithIds}
          defaultValues={{
            title: poem.title,
            content: poem.content
          }}
          showPoetSelect={false}
          cancelHref={`/admin/poets/${poetId}/poems`}
        />
      </div>
    </div>
  )
}