'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import { DeletePoemForPoetButton } from './DeletePoemForPoetButton'
import { PoetPoemsBulkActions } from './PoetPoemsBulkActions'

interface Poem {
  id: string
  title: string
  url: string
  created_at: string
}

interface PoetPoemsTableProps {
  poetId: string
  poetUrl: string
  poems: Poem[]
}

export function PoetPoemsTable({ poetId, poetUrl, poems }: PoetPoemsTableProps) {
  const [selectedPoemIds, setSelectedPoemIds] = useState<string[]>([])
  const checkboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = selectedPoemIds.length > 0 && selectedPoemIds.length < poems.length
    }
  }, [selectedPoemIds.length, poems.length])

  function toggleSelectAll() {
    if (selectedPoemIds.length === poems.length) {
      setSelectedPoemIds([])
    } else {
      setSelectedPoemIds(poems.map(p => p.id))
    }
  }

  function toggleSelectPoem(poemId: string) {
    if (selectedPoemIds.includes(poemId)) {
      setSelectedPoemIds(selectedPoemIds.filter(id => id !== poemId))
    } else {
      setSelectedPoemIds([...selectedPoemIds, poemId])
    }
  }

  return (
    <>
      <PoetPoemsBulkActions 
        poetId={poetId}
        selectedPoemIds={selectedPoemIds}
        onClearSelection={() => setSelectedPoemIds([])}
      />
      
      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 w-12">
                  <input
                    ref={checkboxRef}
                    type="checkbox"
                    checked={poems.length > 0 && selectedPoemIds.length === poems.length}
                    onChange={toggleSelectAll}
                    className="rounded border-input"
                  />
                </th>
                <th className="text-left p-4">Goşgynyň ady</th>
                <th className="text-left p-4">URL</th>
                <th className="text-left p-4">Goşulan wagty</th>
                <th className="text-right p-4">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {poems.map((poem) => (
                <tr key={poem.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedPoemIds.includes(poem.id)}
                      onChange={() => toggleSelectPoem(poem.id)}
                      className="rounded border-input"
                    />
                  </td>
                  <td className="p-4 font-medium">{poem.title}</td>
                  <td className="p-4 text-muted-foreground text-sm max-w-xs truncate">
                    {poem.url}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(poem.created_at).toLocaleDateString('tk-TM')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/p/${poetUrl}/${poem.url}`}
                        target="_blank"
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
                        title="Saýtda gör"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/poets/${poetId}/poems/${poem.id}/edit`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeletePoemForPoetButton 
                        poetId={poetId} 
                        poemId={poem.id} 
                        poemTitle={poem.title} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {poems.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Bu şahyryň goşgusy ýok
            </div>
          )}
        </div>
      </div>
    </>
  )
}