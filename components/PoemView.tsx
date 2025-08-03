'use client'

import { ProfileCard } from '@/components/ProfileCard'

interface PoemViewProps {
  data: {
    title: string
    content: string
    year?: string
    author: {
      fullname: string
      url: string
      avatar: string
    }
    category?: string[]
    notes?: string
    youtube_link?: string
  }
}

export function PoemView({ data }: PoemViewProps) {
  const poemInfo = [data.year, data.author?.fullname].filter(Boolean).join(', ')
  
  return (
    <div>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
          {data.title}
        </h1>
        
        <div 
          className="prose prose-lg max-w-none font-serif [&_p]:mb-4 [&_br]:content-[''] [&_p:empty]:h-4"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
        
        <div className="text-center text-muted-foreground">
          {poemInfo}
        </div>
        
        {data.category && data.category.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {data.category.map((c) => (
              <span 
                key={c} 
                className="px-3 py-1 bg-muted rounded-full text-sm"
              >
                {c}
              </span>
            ))}
          </div>
        )}
        
        {data.notes && (
          <div 
            className="prose prose-sm max-w-none text-muted-foreground italic"
            dangerouslySetInnerHTML={{ __html: data.notes }}
          />
        )}
        
        <div className="flex justify-center">
          <ProfileCard data={data.author} />
        </div>
      </div>
      
      {data.youtube_link && (
        <div className="mt-8 aspect-video max-w-4xl mx-auto">
          <iframe
            src={data.youtube_link}
            className="w-full h-full rounded-lg"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}