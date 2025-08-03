'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Users, BookOpen, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  type: 'poet' | 'poem'
  url: string
}

export function AdminSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Open search with Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search function
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const searchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchData, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    router.push(result.url)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors w-full max-w-sm"
      >
        <Search className="h-4 w-4" />
        <span>Gözle...</span>
        <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Search modal */}
      <div className="fixed inset-x-0 top-20 z-50 mx-auto max-w-2xl px-4">
        <div className="overflow-hidden rounded-2xl bg-background border shadow-2xl">
          {/* Search input */}
          <div className="flex items-center border-b px-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Şahyr ýa-da goşgy gözle..."
              className="flex-1 bg-transparent px-4 py-4 text-base outline-none"
            />
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <button
              onClick={() => {
                setIsOpen(false)
                setQuery('')
              }}
              className="p-2 hover:bg-muted rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="max-h-96 overflow-y-auto py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="flex w-full items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                >
                  <div className="rounded-lg bg-muted p-2">
                    {result.type === 'poet' ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      <BookOpen className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{result.title}</p>
                    {result.subtitle && (
                      <p className="text-muted-foreground">{result.subtitle}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {result.type === 'poet' ? 'Şahyr' : 'Goşgy'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {query && !isLoading && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              "{query}" üçin netije tapylmady
            </div>
          )}
        </div>
      </div>
    </>
  )
}