'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deletePoet } from '@/app/actions/poets'
import { toast } from 'sonner'

interface DeletePoetButtonProps {
  poetId: string
  poetName: string
}

export function DeletePoetButton({ poetId, poetName }: DeletePoetButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    
    try {
      const result = await deletePoet(poetId)
      
      if (result.success) {
        toast.success('Şahyr pozuldy')
      } else {
        toast.error(result.error || 'Ýalňyşlyk ýüze çykdy')
      }
    } catch (error) {
      toast.error('Ýalňyşlyk ýüze çykdy')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Hawa'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="text-xs px-2 py-1 border rounded hover:bg-muted"
        >
          Ýok
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 hover:bg-muted rounded-lg transition-colors text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}