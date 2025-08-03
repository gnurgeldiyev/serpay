import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createEditor } from '@/app/actions/editors'

export default function NewEditorPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/editors"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Täze redaktor goş</h1>
      </div>

      <div className="max-w-2xl">
        <form action={createEditor} className="space-y-6 bg-card p-6 rounded-lg border">
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
              placeholder="Ady Familiýasy"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Parol *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Iň az 6 simwol"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Parol iň az 6 simwol bolmaly
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Goş
            </button>
            <Link
              href="/admin/editors"
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