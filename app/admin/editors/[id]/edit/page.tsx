import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/db/mongodb'
import { Editor } from '@/lib/db/models'
import { updateEditor } from '@/app/actions/editors'

async function getEditor(id: string) {
  await dbConnect()
  const editor = await Editor.findById(id).lean()
  if (!editor || editor.is_deleted) {
    notFound()
  }
  return {
    id: editor._id.toString(),
    fullname: editor.fullname,
    email: editor.email
  }
}

export default async function EditEditorPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const editor = await getEditor(id)
  
  // Bind the editorId to the updateEditor action
  const updateEditorWithId = updateEditor.bind(null, id)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/editors"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold">Redaktory üýtget</h1>
      </div>

      <div className="max-w-2xl">
        <form action={updateEditorWithId} className="space-y-6 bg-card p-6 rounded-lg border">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium mb-2">
              Doly ady *
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              required
              defaultValue={editor.fullname}
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
              defaultValue={editor.email}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Täze parol
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Boş goýsaňyz üýtgemeýär"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paroly üýtgetmek isleseňiz täze paroly giriziň
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Üýtget
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