'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { slugify } from '@/lib/utils'

interface Poem {
  id: string
  title: string
  url: string
  year?: string
}

interface PoemSearchProps {
  poems: Poem[]
  poetUrl: string
}

export function PoemSearch({ poems, poetUrl }: PoemSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPoems = useMemo(() => {
    const q = slugify(searchTerm)
    if (!q) return []
    return poems.filter((poem) => slugify(poem.title).includes(q))
  }, [poems, searchTerm])

  const active = searchTerm.trim().length > 0

  return (
    <div className="mx-auto max-w-xl">
      <div className="group relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand" />
        <input
          type="text"
          placeholder="Goşgy gözle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Goşgy gözle"
          className="w-full rounded-full border border-border bg-card py-4 pl-14 pr-5 text-base shadow-sm transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-brand focus:shadow-md focus:outline-none focus:ring-4 focus:ring-brand/10"
        />
      </div>

      {active && (
        <div className="mt-6">
          <p className="mb-2 text-center text-sm text-muted-foreground">
            {filteredPoems.length} netije tapyldy
          </p>

          {filteredPoems.length > 0 && (
            <div className="divide-y divide-border">
              {filteredPoems.map((poem) => (
                <Link
                  key={poem.id}
                  href={`/p/${poetUrl}/${poem.url}`}
                  className="group flex items-center justify-between gap-3 py-4 transition-colors"
                >
                  <h4 className="font-serif text-lg font-medium text-foreground transition-colors group-hover:text-primary">
                    {poem.title}
                  </h4>
                  {poem.year && (
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {poem.year}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
