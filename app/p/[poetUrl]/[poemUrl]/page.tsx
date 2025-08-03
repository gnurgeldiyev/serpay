import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem } from '@/lib/db/models'

async function getPoem(poetUrl: string, poemUrl: string) {
  await dbConnect()
  
  // Decode URLs to handle special characters
  const decodedPoetUrl = decodeURIComponent(poetUrl)
  const decodedPoemUrl = decodeURIComponent(poemUrl)
  
  const poet = await Poet.findOne({ 
    url: decodedPoetUrl,
    is_deleted: { $ne: true } 
  }).lean()
  
  if (!poet) {
    return null
  }
  
  const poem = await Poem.findOne({ 
    url: decodedPoemUrl,
    author: poet._id,
    is_deleted: { $ne: true }
  })
  .populate('author')
  .lean()
  
  if (!poem) {
    return null
  }
  
  const authorData = poem.author && typeof poem.author === 'object' && '_id' in poem.author
    ? {
        id: poem.author._id.toString(),
        fullname: 'fullname' in poem.author ? String(poem.author.fullname) : '',
        url: 'url' in poem.author ? String(poem.author.url) : '',
        avatar: 'avatar' in poem.author ? poem.author.avatar : undefined
      }
    : {
        id: '',
        fullname: '',
        url: '',
        avatar: undefined
      }

  return {
    id: poem._id.toString(),
    title: poem.title,
    content: poem.content,
    category: poem.category || [],
    year: poem.year,
    created_at: poem.created_at,
    author: authorData
  }
}

type PageProps = {
  params: Promise<{ poetUrl: string; poemUrl: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { poetUrl, poemUrl } = await params
  const poem = await getPoem(poetUrl, poemUrl)
  
  if (!poem) {
    return {
      title: 'Goşgy tapylmady | Serpaý',
      description: 'Gözlenen goşgy tapylmady'
    }
  }

  // Extract plain text from HTML content for description
  const plainText = poem.content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  const description = `${poem.author.fullname} tarapyndan ýazylan "${poem.title}" goşgysy. ${plainText.slice(0, 100)}...`

  return {
    title: `${poem.title} - ${poem.author.fullname} | Serpaý`,
    description,
    openGraph: {
      title: poem.title,
      description,
      type: 'article',
      authors: [poem.author.fullname],
      publishedTime: new Date(poem.created_at).toISOString(),
      modifiedTime: new Date(poem.created_at).toISOString(),
      images: poem.author.avatar && typeof poem.author.avatar === 'string' ? [{ 
        url: poem.author.avatar.startsWith('http') ? poem.author.avatar : `https://serpay.penjire.com${poem.author.avatar}`,
        width: 1200,
        height: 630,
        alt: poem.author.fullname
      }] : [],
      siteName: 'Serpaý',
      locale: 'tk_TM'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${poem.title} - ${poem.author.fullname}`,
      description,
      images: poem.author.avatar && typeof poem.author.avatar === 'string' ? [poem.author.avatar] : []
    },
    alternates: {
      canonical: `https://serpay.penjire.com/p/${poetUrl}/${poemUrl}`
    },
    keywords: [
      poem.author.fullname,
      poem.title,
      'türkmen goşgy',
      'türkmen edebiýaty',
      ...poem.category
    ]
  }
}

export default async function PoemPage({ params }: PageProps) {
  const { poetUrl, poemUrl } = await params
  const poem = await getPoem(poetUrl, poemUrl)
  
  if (!poem) {
    notFound()
  }
  
  // JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": poem.title,
    "author": {
      "@type": "Person",
      "name": poem.author.fullname,
      "url": `https://serpay.penjire.com/p/${poem.author.url}`
    },
    "datePublished": poem.year || poem.created_at,
    "dateCreated": poem.year || poem.created_at,
    "inLanguage": "tk",
    "genre": poem.category.join(", ") || "Goşgy",
    "publisher": {
      "@type": "Organization",
      "name": "Serpaý",
      "url": "https://serpay.penjire.com"
    },
    "url": `https://serpay.penjire.com/p/${poetUrl}/${poemUrl}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Serpaý – Goşgular Çemeni",
      "url": "https://serpay.penjire.com"
    }
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href={`/p/${poem.author.url}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {poem.author.fullname}
        </Link>
        
        {/* Poem header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-[family-name:var(--font-inria-serif-bold)] mb-4">
            {poem.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link
              href={`/p/${poem.author.url}`}
              className="hover:text-foreground transition-colors"
            >
              {poem.author.fullname}
            </Link>
            {poem.year && (
              <>
                <span>•</span>
                <time>{poem.year}</time>
              </>
            )}
            {poem.category.length > 0 && (
              <>
                <span>•</span>
                <span>{poem.category.join(', ')}</span>
              </>
            )}
          </div>
        </header>
        
        {/* Poem content */}
        <div 
          className="prose prose-lg max-w-none font-[family-name:var(--font-inria-serif-regular)] [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: poem.content }}
        />
      </article>
    </>
  )
}