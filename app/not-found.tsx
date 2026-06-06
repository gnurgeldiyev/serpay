import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PoemSearchBox } from '@/components/PoemSearchBox'

export const metadata: Metadata = {
  title: 'Sahypa tapylmady',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:py-28">
      <p className="font-serif text-7xl font-bold tracking-tight text-primary sm:text-8xl">
        404
      </p>

      <div className="mt-6 flex items-center justify-center gap-2" aria-hidden="true">
        <span className="h-px w-8 bg-border" />
        <span className="h-1.5 w-1.5 rotate-45 bg-primary/70" />
        <span className="h-px w-8 bg-border" />
      </div>

      <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Sahypa tapylmady
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        Gözlän sahypaňyz tapylmady. Belki, gözleýän goşgyňyzy aşakdan tapyp bilersiňiz.
      </p>

      {/* Poem search */}
      <div className="mt-10 w-full">
        <PoemSearchBox />
      </div>

      {/* Home link */}
      <Link
        href="/"
        className="group mt-12 inline-flex items-center gap-2 text-sm font-medium text-brand"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Baş sahypa
      </Link>
    </div>
  )
}
