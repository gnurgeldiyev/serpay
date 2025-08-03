import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import dbConnect from '@/lib/db/mongodb'
import { Poet } from '@/lib/db/models'
import { createPoem } from '@/app/actions/poems'
import { PoemForm } from '@/components/admin/PoemForm'

async function getPoets() {
  await dbConnect()
  const poets = await Poet.find({ is_deleted: false }).sort({ fullname: 1 }).lean()
  return poets.map(poet => ({
    id: poet._id.toString(),
    fullname: poet.fullname
  }))
}

export default async function NewPoemPage() {
  const poets = await getPoets()

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/poems"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Täze goşgy goş</h1>
      </div>

      <div className="max-w-3xl">
        <PoemForm
          action={createPoem}
          poets={poets}
          showPoetSelect={true}
          cancelHref="/admin/poems"
        />
      </div>
    </div>
  )
}