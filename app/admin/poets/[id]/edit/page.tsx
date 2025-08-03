import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/db/mongodb'
import { Poet } from '@/lib/db/models'
import { updatePoet } from '@/app/actions/poets'

async function getPoet(id: string) {
  await dbConnect()
  const poet = await Poet.findById(id).lean()
  if (!poet || poet.is_deleted) {
    notFound()
  }
  return {
    id: poet._id.toString(),
    fullname: poet.fullname,
    url: poet.url,
    birth_date: poet.birth_date,
    death_date: poet.death_date,
    avatar: poet.avatar
  }
}

export default async function EditPoetPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const poet = await getPoet(id)
  
  // Bind the poetId to the updatePoet action
  const updatePoetWithId = updatePoet.bind(null, id)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/poets"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">Şahyry üýtget</h1>
        </div>
        <Link
          href={`/admin/poets/${id}/poems`}
          className="inline-flex items-center px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Goşgulary dolandyr
        </Link>
      </div>

      <div className="max-w-2xl">
        <form action={updatePoetWithId} className="space-y-6 bg-card p-6 rounded-lg border">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium mb-2">
              Doly ady *
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              required
              defaultValue={poet.fullname}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Magtymguly Pyragy"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              URL *
            </label>
            <input
              id="url"
              name="url"
              type="text"
              required
              pattern="[a-z0-9-]+"
              defaultValue={poet.url}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="magtymguly-pyragy"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Diňe kiçi harplar, sanlar we defis (-) ulanyp bilersiňiz
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="birth_date" className="block text-sm font-medium mb-2">
                Doglan ýyly
              </label>
              <input
                id="birth_date"
                name="birth_date"
                type="text"
                defaultValue={poet.birth_date || ''}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="1733"
              />
            </div>

            <div>
              <label htmlFor="death_date" className="block text-sm font-medium mb-2">
                Aradan çykan ýyly
              </label>
              <input
                id="death_date"
                name="death_date"
                type="text"
                defaultValue={poet.death_date || ''}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="1807"
              />
            </div>
          </div>

          <div>
            <label htmlFor="avatar" className="block text-sm font-medium mb-2">
              Surat URL
            </label>
            <input
              id="avatar"
              name="avatar"
              type="url"
              defaultValue={poet.avatar || ''}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="https://example.com/surat.jpg"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Üýtget
            </button>
            <Link
              href="/admin/poets"
              className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Ýatyr
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}