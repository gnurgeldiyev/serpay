import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem } from '@/lib/db/models'
import { DeletePoetButton } from '@/components/admin/DeletePoetButton'

async function getPoets() {
  await dbConnect()
  const poets = await Poet.find({ is_deleted: false }).sort({ created_at: -1 }).lean()
  
  // Get poem counts for each poet
  const poetIds = poets.map(p => p._id)
  const poemCounts = await Poem.aggregate([
    { $match: { author: { $in: poetIds }, is_deleted: { $ne: true } } },
    { $group: { _id: '$author', count: { $sum: 1 } } }
  ])
  
  const poemCountMap = Object.fromEntries(
    poemCounts.map(pc => [pc._id.toString(), pc.count])
  )
  
  return poets.map(poet => ({
    id: poet._id.toString(),
    fullname: poet.fullname,
    url: poet.url,
    birth_date: poet.birth_date,
    death_date: poet.death_date,
    created_at: poet.created_at,
    poemsCount: poemCountMap[poet._id.toString()] || 0
  }))
}

export default async function PoetsPage() {
  const poets = await getPoets()

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Şahyrlar</h1>
          <p className="text-muted-foreground mt-1">Ähli şahyrlary dolandyryň</p>
        </div>
        <Link
          href="/admin/poets/new"
          className="inline-flex items-center px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Täze şahyr
        </Link>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Ady</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">URL</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Doglan ýyly</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Aradan çykan ýyly</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Goşgular</th>
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">Goşulan wagty</th>
                <th className="text-right p-4 font-medium text-sm text-muted-foreground">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {poets.map((poet) => (
                <tr key={poet.id} className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">{poet.fullname}</td>
                  <td className="p-4 text-muted-foreground">{poet.url}</td>
                  <td className="p-4">{poet.birth_date || '-'}</td>
                  <td className="p-4">{poet.death_date || '-'}</td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/admin/poets/${poet.id}/poems`}
                      className="hover:underline"
                    >
                      {poet.poemsCount}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(poet.created_at).toLocaleDateString('tk-TM')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/poets/${poet.id}/poems`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Goşgulary dolandyr"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/poets/${poet.id}/edit`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeletePoetButton poetId={poet.id} poetName={poet.fullname} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {poets.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Şahyr ýok
            </div>
          )}
        </div>
      </div>
    </div>
  )
}