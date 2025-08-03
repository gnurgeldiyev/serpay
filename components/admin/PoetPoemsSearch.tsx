'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

export function PoetPoemsSearch({ poetId }: { poetId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (query) {
        params.set('q', query)
      } else {
        params.delete('q')
      }
      router.push(`/admin/poets/${poetId}/poems?${params.toString()}`)
    })
  }

  function clearSearch() {
    setQuery('')
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.delete('q')
      router.push(`/admin/poets/${poetId}/poems?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Goşgy gözle..."
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-input bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={isPending}
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  )
}