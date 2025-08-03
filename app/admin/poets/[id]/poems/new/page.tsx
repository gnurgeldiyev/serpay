import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/db/mongodb'
import { Poet } from '@/lib/db/models'
import { createPoemForPoet } from '@/app/actions/poems'
import { PoemForm } from '@/components/admin/PoemForm'

async function getPoet(id: string) {
  await dbConnect()
  const poet = await Poet.findById(id).lean()
  if (!poet || poet.is_deleted) {
    notFound()
  }
  return {
    id: poet._id.toString(),
    fullname: poet.fullname
  }
}

export default async function NewPoemForPoetPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const poet = await getPoet(id)
  
  // Bind the poetId to the createPoemForPoet action
  const createPoemWithPoetId = createPoemForPoet.bind(null, id)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/admin/poets/${id}/poems`}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Täze goşgy goş</h1>
          <p className="text-muted-foreground">{poet.fullname} üçin</p>
        </div>
      </div>

      <div className="max-w-3xl">
        <PoemForm
          action={createPoemWithPoetId}
          showPoetSelect={false}
          cancelHref={`/admin/poets/${id}/poems`}
        />
      </div>
    </div>
  )
}