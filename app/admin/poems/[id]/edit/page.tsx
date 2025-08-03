import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/db/mongodb'
import { Poem, Poet } from '@/lib/db/models'
import { updatePoem } from '@/app/actions/poems'
import { PoemForm } from '@/components/admin/PoemForm'

async function getPoem(id: string) {
  await dbConnect()
  const poem = await Poem.findById(id).populate('author').lean()
  if (!poem || (poem as any).is_deleted === true) {
    notFound()
  }
  return {
    id: poem._id.toString(),
    title: poem.title,
    content: poem.content,
    poetId: (poem.author && typeof poem.author === 'object' && '_id' in poem.author)
      ? poem.author._id.toString()
      : ''
  }
}

async function getPoets() {
  await dbConnect()
  const poets = await Poet.find({ is_deleted: false }).sort({ fullname: 1 }).lean()
  return poets.map(poet => ({
    id: poet._id.toString(),
    fullname: poet.fullname
  }))
}

export default async function EditPoemPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const [poem, poets] = await Promise.all([
    getPoem(id),
    getPoets()
  ])
  
  // Bind the poemId to the updatePoem action
  const updatePoemWithId = updatePoem.bind(null, id)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/poems"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Goşgyny üýtget</h1>
      </div>

      <div className="max-w-3xl">
        <PoemForm
          action={updatePoemWithId}
          defaultValues={{
            title: poem.title,
            content: poem.content,
            poetId: poem.poetId
          }}
          poets={poets}
          showPoetSelect={true}
          cancelHref="/admin/poems"
        />
      </div>
    </div>
  )
}