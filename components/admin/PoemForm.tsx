'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PoemEditor } from './PoemEditor'
import { useToast } from '@/contexts/toast-context'

interface PoemFormProps {
  action: (formData: FormData) => Promise<{ success: boolean; error?: string; message?: string } | void>
  defaultValues?: {
    title?: string
    content?: string
    poetId?: string
  }
  poets?: Array<{ id: string; fullname: string }>
  showPoetSelect?: boolean
  cancelHref: string
}

export function PoemForm({ 
  action, 
  defaultValues = {}, 
  poets = [], 
  showPoetSelect = true,
  cancelHref 
}: PoemFormProps) {
  const [content, setContent] = useState(defaultValues.content || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    
    try {
      // Add the rich text content to form data
      formData.set('content', content)
      const result = await action(formData)
      
      // Check if the action returned a result (for update action)
      if (result && 'success' in result) {
        if (result.success) {
          showToast(result.message || 'Üstünlikli ýerine ýetirildi', 'success')
          // Stay on the same page for edits
          router.refresh()
        } else {
          showToast(result.error || 'Säwlik ýüze çykdy', 'error')
        }
        setIsSubmitting(false)
      }
      // If no result returned, it means it's a create action that redirects
    } catch (error) {
      showToast('Säwlik ýüze çykdy', 'error')
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border">
      {showPoetSelect && (
        <div>
          <label htmlFor="poetId" className="block text-sm font-medium mb-2">
            Şahyr *
          </label>
          <select
            id="poetId"
            name="poetId"
            required
            defaultValue={defaultValues.poetId}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Şahyr saýlaň</option>
            {poets.map((poet) => (
              <option key={poet.id} value={poet.id}>
                {poet.fullname}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Goşgynyň ady *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues.title}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Goşgynyň ady"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Goşgynyň teksti *
        </label>
        
        <PoemEditor
          content={content}
          onChange={setContent}
          placeholder="Goşgynyň tekstini giriziň..."
        />
        
        <p className="text-xs text-muted-foreground mt-2">
          Enter - täze setir, Shift+Enter - täze abzas. Setir aýry üçin "↵" düwmesini hem ulanyp bilersiňiz.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Ýüklenýär...' : (defaultValues.title ? 'Üýtget' : 'Goş')}
        </button>
        <Link
          href={cancelHref}
          className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors"
        >
          Ýatyr
        </Link>
      </div>
    </form>
  )
}