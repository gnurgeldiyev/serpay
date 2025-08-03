import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import dbConnect from '@/lib/db/mongodb'
import { Editor } from '@/lib/db/models'
import { DeleteEditorButton } from '@/components/admin/DeleteEditorButton'

async function getEditors() {
  await dbConnect()
  const editors = await Editor.find({ is_deleted: false }).sort({ created_at: -1 }).lean()
  return editors.map(editor => ({
    id: editor._id.toString(),
    fullname: editor.fullname,
    email: editor.email,
    created_at: editor.created_at
  }))
}

export default async function EditorsPage() {
  const editors = await getEditors()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Redaktorlar</h1>
        <Link
          href="/admin/editors/new"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Täze redaktor
        </Link>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Ady</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Goşulan wagty</th>
                <th className="text-right p-4">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {editors.map((editor) => (
                <tr key={editor.id} className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">{editor.fullname}</td>
                  <td className="p-4 text-muted-foreground">{editor.email}</td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(editor.created_at).toLocaleDateString('tk-TM')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/editors/${editor.id}/edit`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteEditorButton 
                        editorId={editor.id} 
                        editorName={editor.fullname} 
                        editorEmail={editor.email}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editors.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Redaktor ýok
            </div>
          )}
        </div>
      </div>
    </div>
  )
}