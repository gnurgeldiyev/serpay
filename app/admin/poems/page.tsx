import Link from 'next/link'
import { Plus } from 'lucide-react'
import dbConnect from '@/lib/db/mongodb'
import { Poem, Poet } from '@/lib/db/models'
import { PoemsListView } from '@/components/admin/PoemsListView'

export const dynamic = 'force-dynamic'

async function getPoemsGroupedByPoet() {
  await dbConnect()
  
  // Get all poets with their poems
  const poets = await Poet.find({ is_deleted: { $ne: true } })
    .sort({ fullname: 1 })
    .lean()
  
  // Get poems grouped by poet
  const poemsGrouped = await Promise.all(
    poets.map(async (poet) => {
      const poems = await Poem.find({ 
        author: poet._id,
        is_deleted: { $ne: true } 
      })
      .sort({ title: 1 })
      .lean()
      
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
          created_at: poem.created_at
        }))
      }
    })
  )
  
  // Filter out poets with no poems
  return poemsGrouped.filter(group => group.poems.length > 0)
}

export default async function PoemsPage() {
  const poemsGrouped = await getPoemsGroupedByPoet()
  const totalPoems = poemsGrouped.reduce((sum, group) => sum + group.poems.length, 0)

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goşgular</h1>
          <p className="text-muted-foreground mt-1">
            {totalPoems} goşgy, {poemsGrouped.length} şahyr
          </p>
        </div>
        <Link
          href="/admin/poems/new"
          className="inline-flex items-center px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Täze goşgy
        </Link>
      </div>

      <PoemsListView poemsGrouped={poemsGrouped} />
    </div>
  )
}