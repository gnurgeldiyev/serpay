'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, LayoutGrid, List, ChevronDown, ChevronRight } from 'lucide-react'
import { DeletePoemButton } from './DeletePoemButton'

interface Poem {
  id: string
  title: string
  url: string
  created_at: Date
}

interface Poet {
  id: string
  fullname: string
  url: string
}

interface GroupedPoems {
  poet: Poet
  poems: Poem[]
}

interface PoemsListViewProps {
  poemsGrouped: GroupedPoems[]
}

export function PoemsListView({ poemsGrouped }: PoemsListViewProps) {
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped')
  const [expandedPoets, setExpandedPoets] = useState<Set<string>>(new Set())
  
  // Flatten poems for flat view
  const flatPoems = poemsGrouped.flatMap(group => 
    group.poems.map(poem => ({
      ...poem,
      poet: group.poet
    }))
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const togglePoetExpanded = (poetId: string) => {
    const newExpanded = new Set(expandedPoets)
    if (newExpanded.has(poetId)) {
      newExpanded.delete(poetId)
    } else {
      newExpanded.add(poetId)
    }
    setExpandedPoets(newExpanded)
  }

  const expandAll = () => {
    setExpandedPoets(new Set(poemsGrouped.map(group => group.poet.id)))
  }

  const collapseAll = () => {
    setExpandedPoets(new Set())
  }

  return (
    <div>
      {/* View toggle and controls */}
      <div className="flex justify-between items-center mb-4">
        {/* Expand/Collapse all buttons - only show in grouped view */}
        {viewMode === 'grouped' && (
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Ählisini aç
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={collapseAll}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Ählisini ýap
            </button>
          </div>
        )}
        
        {/* Spacer for flat view */}
        {viewMode === 'flat' && <div />}
        
        {/* View mode toggle */}
        <div className="inline-flex rounded-lg border bg-muted/30 p-1">
          <button
            onClick={() => setViewMode('grouped')}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'grouped' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Şahyr boýunça
          </button>
          <button
            onClick={() => setViewMode('flat')}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'flat' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="h-4 w-4" />
            Hemmesi
          </button>
        </div>
      </div>

      {viewMode === 'grouped' ? (
        /* Grouped view */
        <div className="space-y-6">
          {poemsGrouped.map((group) => (
            <div key={group.poet.id} className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              {/* Poet header - clickable */}
              <div 
                className="bg-muted/30 px-6 py-4 border-b cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => togglePoetExpanded(group.poet.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {expandedPoets.has(group.poet.id) ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <h2 className="text-lg font-semibold">{group.poet.fullname}</h2>
                      <p className="text-sm text-muted-foreground">
                        {group.poems.length} goşgy
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/admin/poets/${group.poet.id}/poems`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Ählisini gör →
                  </Link>
                </div>
              </div>

              {/* Poems table - only show when expanded */}
              {expandedPoets.has(group.poet.id) && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Goşgynyň ady</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">URL</th>
                        <th className="text-left p-4 font-medium text-sm text-muted-foreground">Goşulan wagty</th>
                        <th className="text-right p-4 font-medium text-sm text-muted-foreground">Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.poems.map((poem) => (
                        <tr key={poem.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="p-4 font-medium">{poem.title}</td>
                          <td className="p-4 text-muted-foreground text-sm max-w-xs truncate">
                            {poem.url}
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">
                            {new Date(poem.created_at).toLocaleDateString('tk-TM')}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/p/${group.poet.url}/${poem.url}`}
                                target="_blank"
                                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
                                title="Saýtda gör"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </Link>
                              <Link
                                href={`/admin/poems/${poem.id}/edit`}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <DeletePoemButton poemId={poem.id} poemTitle={poem.title} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Flat view */
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 font-medium text-sm text-muted-foreground">Goşgynyň ady</th>
                  <th className="text-left p-4 font-medium text-sm text-muted-foreground">Şahyr</th>
                  <th className="text-left p-4 font-medium text-sm text-muted-foreground">URL</th>
                  <th className="text-left p-4 font-medium text-sm text-muted-foreground">Goşulan wagty</th>
                  <th className="text-right p-4 font-medium text-sm text-muted-foreground">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {flatPoems.map((poem) => (
                  <tr key={poem.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-4 font-medium">{poem.title}</td>
                    <td className="p-4">
                      <Link
                        href={`/admin/poets/${poem.poet.id}/edit`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {poem.poet.fullname}
                      </Link>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm max-w-xs truncate">
                      {poem.url}
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(poem.created_at).toLocaleDateString('tk-TM')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/p/${poem.poet.url}/${poem.url}`}
                          target="_blank"
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
                          title="Saýtda gör"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/poems/${poem.id}/edit`}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeletePoemButton poemId={poem.id} poemTitle={poem.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {poemsGrouped.length === 0 && (
        <div className="bg-card rounded-2xl border p-12 text-center">
          <p className="text-muted-foreground">Goşgy ýok</p>
        </div>
      )}
    </div>
  )
}