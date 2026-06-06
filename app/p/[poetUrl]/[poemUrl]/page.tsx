import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import { Avatar } from '@/components/Avatar'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem } from '@/lib/db/models'

async function getPoem(poetUrl: string, poemUrl: string) {
  await dbConnect()
  
  // Decode params, then match either the clean slug or the legacy url
  // (so old percent-encoded Turkmen links keep resolving).
  const decodedPoetUrl = decodeURIComponent(poetUrl)
  const decodedPoemUrl = decodeURIComponent(poemUrl)

  const poet = await Poet.findOne({
    $or: [{ slug: decodedPoetUrl }, { url: decodedPoetUrl }],
    is_deleted: { $ne: true }
  }).lean()

  if (!poet) {
    return null
  }

  const poem = await Poem.findOne({
    $or: [{ slug: decodedPoemUrl }, { url: decodedPoemUrl }],
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
        url: 'slug' in poem.author && poem.author.slug
          ? String(poem.author.slug)
          : 'url' in poem.author ? String(poem.author.url) : '',
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
    slug: poem.slug || poem.url,
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

export const revalidate = 3600 // Revalidate every hour

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
      canonical: `https://serpay.penjire.com/p/${poem.author.url}/${poem.slug}`
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
    "url": `https://serpay.penjire.com/p/${poem.author.url}/${poem.slug}`,
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
      
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Back button */}
        <Link
          href={`/p/${poem.author.url}`}
          className="group mb-14 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>{poem.author.fullname}</span>
        </Link>

        {/* Poem header */}
        <header className="text-center">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {poem.title}
          </h1>

          <div className="mt-5 flex items-center justify-center gap-2" aria-hidden="true">
            <span className="h-px w-8 bg-border" />
            <span className="h-1.5 w-1.5 rotate-45 bg-primary/70" />
            <span className="h-px w-8 bg-border" />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <Link
              href={`/p/${poem.author.url}`}
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              {poem.author.fullname}
            </Link>
            {poem.year && (
              <>
                <span className="h-1 w-1 rotate-45 bg-primary/40" aria-hidden="true" />
                <time>{poem.year}</time>
              </>
            )}
            {poem.category.length > 0 && (
              <>
                <span className="h-1 w-1 rotate-45 bg-primary/40" aria-hidden="true" />
                <span>{poem.category.join(', ')}</span>
              </>
            )}
          </div>
        </header>

        {/* Poem content */}
        <div className="mx-auto mt-12 max-w-2xl whitespace-pre-line text-center font-serif text-lg leading-loose text-foreground/90 sm:text-xl">
          {poem.content}
        </div>

        {/* Author footer */}
        <div className="mx-auto mt-16 max-w-2xl border-t border-border/70 pt-10">
          <Link
            href={`/p/${poem.author.url}`}
            className="group flex items-center justify-center gap-4"
          >
            <Avatar
              src={typeof poem.author.avatar === 'string' ? poem.author.avatar : undefined}
              name={poem.author.fullname}
              size={56}
            />
            <div>
              <p className="font-serif text-lg font-medium text-foreground transition-colors group-hover:text-primary">
                {poem.author.fullname}
              </p>
              <span className="mt-0.5 inline-flex items-center gap-1 text-sm font-medium text-brand">
                Ähli goşgulary
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </div>
      </article>
    </>
  )
}