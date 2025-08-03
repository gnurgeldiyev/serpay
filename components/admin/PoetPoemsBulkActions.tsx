'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { bulkDeletePoems } from '@/app/actions/poems'
import { toast } from 'sonner'

interface PoetPoemsBulkActionsProps {
  poetId: string
  selectedPoemIds: string[]
  onClearSelection: () => void
}

export function PoetPoemsBulkActions({ 
  poetId, 
  selectedPoemIds, 
  onClearSelection 
}: PoetPoemsBulkActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleBulkDelete() {
    setIsDeleting(true)
    
    try {
      const result = await bulkDeletePoems(poetId, selectedPoemIds)
      
      if (result.success) {
        toast.success(`${selectedPoemIds.length} goşgy pozuldy`)
        onClearSelection()
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

  if (selectedPoemIds.length === 0) return null

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm font-medium">
        {selectedPoemIds.length} goşgy saýlandy
      </span>
      
      {showConfirm ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Hakykatdanam pozmalymy?
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Pozulýar...
              </>
            ) : (
              <>
                <Trash2 className="h-3 w-3 mr-1" />
                Hawa, poz
              </>
            )}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="px-3 py-1 text-sm border rounded hover:bg-muted"
          >
            Ýatyr
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Saýlananlary poz
          </button>
          <button
            onClick={onClearSelection}
            className="px-3 py-1 text-sm border rounded hover:bg-muted"
          >
            Arassala
          </button>
        </>
      )}
    </div>
  )
}