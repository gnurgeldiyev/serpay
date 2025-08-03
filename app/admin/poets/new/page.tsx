import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createPoet } from '@/app/actions/poets'

export default function NewPoetPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/poets"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Täze şahyr goş</h1>
      </div>

      <div className="max-w-2xl">
        <form action={createPoet} className="space-y-6 bg-card p-6 rounded-lg border">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium mb-2">
              Doly ady *
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              required
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
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="https://example.com/surat.jpg"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Goş
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