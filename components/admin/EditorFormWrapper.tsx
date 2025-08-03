'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateEditor } from '@/app/actions/editors'

interface EditorFormWrapperProps {
  editorId: string
  editor: {
    fullname: string
    email: string
  }
}

export function EditorFormWrapper({ editorId, editor }: EditorFormWrapperProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError('')
    setIsLoading(true)
    
    try {
      const result = await updateEditor(editorId, formData)
      if (!result.success) {
        setError(result.error)
        setIsLoading(false)
      }
      // If successful, the server action will redirect
    } catch (err) {
      setError('Näsazlyk ýüze çykdy')
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border">
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded">
          {error}
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
          defaultValue={editor.fullname}
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
          defaultValue={editor.email}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Parol (boş goýsaňyz üýtgemez)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Ýatda saklanýar...' : 'Üýtget'}
        </button>
      </div>
    </form>
  )
}