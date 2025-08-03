'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

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
    if (!searchTerm) return poems
    
    return poems.filter(poem =>
      poem.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [poems, searchTerm])

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Goşgy gözle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {searchTerm && (
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredPoems.length} netije tapyldy
        </div>
      )}

      {searchTerm && filteredPoems.length > 0 && (
        <div className="divide-y divide-border">
          {filteredPoems.map((poem) => (
            <Link 
              key={poem.id} 
              href={`/p/${poetUrl}/${poem.url}`}
              className="group block py-4 hover:bg-muted/50 transition-colors -mx-4 px-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {poem.title}
                </h4>
                {poem.year && (
                  <span className="text-sm text-muted-foreground">
                    {poem.year}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}