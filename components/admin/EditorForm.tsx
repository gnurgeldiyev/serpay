'use client'

import { useFormState } from 'react-dom'
import { updateEditor, createEditor } from '@/app/actions/editors'

interface EditorFormProps {
  editor?: {
    id: string
    fullname: string
    email: string
  }
}

export function EditorForm({ editor }: EditorFormProps) {
  const [state, formAction] = useFormState(
    editor ? updateEditor.bind(null, editor.id) : createEditor,
    { success: false, error: '' }
  )

  return (
    <form action={formAction} className="space-y-6 bg-card p-6 rounded-lg border">
      {state.error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded">
          {state.error}
        </div>
      )}
      
      <div>
        <label htmlFor="fullname" className="block text-sm font-medium mb-2">
          Doly ady *
        </label>
        <input
          id="fullname"
          name="fullname"
          type="text"
          required
          defaultValue={editor?.fullname}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          E-poçta *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={editor?.email}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Parol {editor ? '(boş goýsaňyz üýtgemez)' : '*'}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required={!editor}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {editor ? 'Üýtget' : 'Döret'}
        </button>
      </div>
    </form>
  )
}