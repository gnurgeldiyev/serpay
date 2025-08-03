import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem } from '@/lib/db/models'
import { PoetHeader } from '@/components/PoetHeader'
import { PoemSearch } from '@/components/PoemSearch'

async function getPoet(poetUrl: string) {
  await dbConnect()
  
  // Decode the URL to handle special characters
  const decodedUrl = decodeURIComponent(poetUrl)
  
  const poet = await Poet.findOne({ 
    url: decodedUrl,
    is_deleted: { $ne: true }
  }).lean()
  
  if (!poet) {
    return null
  }
  
  const poems = await Poem.find({ 
    author: poet._id,
    is_deleted: { $ne: true }
  })
  .sort({ title: 1 })
  .lean()
  
  return {
    id: poet._id.toString(),
    fullname: poet.fullname,
    url: poet.url,
    bio: poet.bio || '',
    birth_date: poet.birth_date,
    death_date: poet.death_date,
    birth_place: (poet as any).birth_place || undefined,
    education: (poet as any).education || undefined,
    quote: (poet as any).quote || undefined,
    avatar: poet.avatar,
    poems: poems.map(poem => ({
      id: poem._id.toString(),
      title: poem.title,
      url: poem.url,
      category: poem.category || [],
      year: poem.year
    }))
  }
}

type PageProps = {
  params: Promise<{ poetUrl: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { poetUrl } = await params
  const poet = await getPoet(poetUrl)
  
  if (!poet) {
    return {
      title: 'Şahyr tapylmady | Serpaý',
      description: 'Gözlenen şahyr tapylmady'
    }
  }

  const description = poet.bio 
    ? poet.bio.slice(0, 160) 
    : `${poet.fullname} - Türkmen şahyry. ${poet.poems.length} sany goşgy.`

  return {
    title: `${poet.fullname} | Serpaý – Goşgular Çemeni`,
    description,
    openGraph: {
      title: poet.fullname,
      description,
      images: poet.avatar ? [{ 
        url: poet.avatar.startsWith('http') ? poet.avatar : `https://serpay.penjire.com${poet.avatar}`,
        width: 1200,
        height: 630,
        alt: poet.fullname
      }] : [],
      type: 'profile',
      siteName: 'Serpaý',
      locale: 'tk_TM'
    },
    twitter: {
      card: 'summary_large_image',
      title: poet.fullname,
      description,
      images: poet.avatar ? [poet.avatar] : []
    },
    alternates: {
      canonical: `https://serpay.penjire.com/p/${poetUrl}`
    },
    other: {
      'og:profile:first_name': poet.fullname.split(' ')[0],
      'og:profile:last_name': poet.fullname.split(' ').slice(1).join(' ')
    }
  }
}

export default async function PoetPage({ params }: PageProps) {
  const { poetUrl } = await params
  const poet = await getPoet(poetUrl)
  
  if (!poet) {
    notFound()
  }
  
  // Group poems by first letter
  const poemsByLetter = poet.poems.reduce((acc, poem) => {
    const firstLetter = poem.title.charAt(0).toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(poem)
    return acc
  }, {} as Record<string, typeof poet.poems>)
  
  const sortedLetters = Object.keys(poemsByLetter).sort()
  
  // JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": poet.fullname,
    "description": poet.bio,
    "birthDate": poet.birth_date,
    "deathDate": poet.death_date,
    "birthPlace": poet.birth_place,
    "image": poet.avatar,
    "sameAs": [`https://serpay.penjire.com/p/${poet.url}`],
    "worksFor": {
      "@type": "Organization",
      "name": "Türkmen edebiýaty"
    },
    "workExample": poet.poems.slice(0, 5).map(poem => ({
      "@type": "CreativeWork",
      "name": poem.title,
      "datePublished": poem.year,
      "url": `https://serpay.penjire.com/p/${poet.url}/${poem.url}`
    }))
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm sm:text-base">Baş sahypa</span>
        </Link>
        
        {/* Poet info */}
        <PoetHeader poet={poet} />
        
        {/* Search */}
        <div className="mt-12 mb-8">
          <PoemSearch poems={poet.poems} poetUrl={poet.url} />
        </div>
        
        {/* Poems grouped by letter */}
        <div className="mt-12">
          <h2 className="text-2xl font-[family-name:var(--font-inria-serif-bold)] mb-8">
            Goşgular ({poet.poems.length})
          </h2>
          
          {sortedLetters.map((letter) => (
            <div key={letter} className="mb-8">
              <h3 className="text-lg font-[family-name:var(--font-inria-serif-bold)] text-muted-foreground mb-4">
                {letter}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {poemsByLetter[letter].map((poem) => (
                  <Link
                    key={poem.id}
                    href={`/p/${poet.url}/${poem.url}`}
                    className="group"
                  >
                    <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-all">
                      <h4 className="font-[family-name:var(--font-inria-serif-regular)] text-lg group-hover:text-primary transition-colors">
                        {poem.title}
                      </h4>
                      {poem.category.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {poem.category.join(', ')}
                        </p>
                      )}
                      {poem.year && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {poem.year}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}