import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import dbConnect from '@/lib/db/mongodb'
import { Poet, Poem } from '@/lib/db/models'
import { PoetHeader } from '@/components/PoetHeader'
import { PoemSearch } from '@/components/PoemSearch'

async function getPoet(poetUrl: string) {
  await dbConnect()
  
  // Decode the param, then match either the clean slug or the legacy url
  // (so old percent-encoded Turkmen links keep resolving).
  const decodedUrl = decodeURIComponent(poetUrl)

  const poet = await Poet.findOne({
    $or: [{ slug: decodedUrl }, { url: decodedUrl }],
    is_deleted: { $ne: true }
  }).lean()

  if (!poet) {
    return null
  }

  const poems = await Poem.find({
    author: poet._id,
    is_deleted: { $ne: true }
  })
  .select('title url slug category year')
  .sort({ title: 1 })
  .lean()

  return {
    id: poet._id.toString(),
    fullname: poet.fullname,
    url: poet.slug || poet.url,
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
      url: poem.slug || poem.url,
      category: poem.category || [],
      year: poem.year
    }))
  }
}

type PageProps = {
  params: Promise<{ poetUrl: string }>
}

export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
  await dbConnect()

  // Pre-generate pages for top 20 poets with most poems
  const topPoets = await Poet.aggregate([
    { $match: { is_deleted: { $ne: true } } },
    {
      $lookup: {
        from: 'poems',
        let: { poetId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$author', '$$poetId'] },
                  { $ne: ['$is_deleted', true] }
                ]
              }
            }
          },
          { $project: { _id: 1 } }
        ],
        as: 'poems'
      }
    },
    {
      $project: {
        url: 1,
        slug: 1,
        poems_count: { $size: '$poems' }
      }
    },
    { $sort: { poems_count: -1 } },
    { $limit: 20 }
  ])

  return topPoets.map(poet => ({
    poetUrl: poet.slug || poet.url
  }))
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
      canonical: `https://serpay.penjire.com/p/${poet.url}`
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

  // Breadcrumb trail: Home > Poet
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Baş sahypa",
        "item": "https://serpay.penjire.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": poet.fullname,
        "item": `https://serpay.penjire.com/p/${poet.url}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Back button */}
        <Link
          href="/"
          className="group mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Baş sahypa</span>
        </Link>

        {/* Poet info */}
        <PoetHeader poet={poet} />

        {/* Search */}
        <div className="mt-14 mb-10">
          <PoemSearch poetId={poet.id} />
        </div>

        {/* Poems grouped by letter */}
        <div className="mt-12">
          <div className="mb-10 flex items-center gap-3">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Goşgular
            </h2>
            <span className="rounded-full bg-brand-subtle px-2.5 py-0.5 text-sm font-medium text-brand">
              {poet.poems.length}
            </span>
          </div>

          {sortedLetters.map((letter) => (
            <div key={letter} className="mb-10">
              <div className="mb-4 flex items-center gap-4">
                <h3 className="font-serif text-xl font-bold text-primary">
                  {letter}
                </h3>
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {poemsByLetter[letter].map((poem) => (
                  <Link
                    key={poem.id}
                    href={`/p/${poet.url}/${poem.url}`}
                    className="group rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40 hover:bg-brand-subtle/40"
                  >
                    <h4 className="font-serif text-lg font-medium text-foreground transition-colors group-hover:text-primary">
                      {poem.title}
                    </h4>
                    {(poem.category.length > 0 || poem.year) && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {[poem.category.join(', '), poem.year]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
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