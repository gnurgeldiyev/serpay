'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-3xl mx-auto text-center">
        {/* Illustration */}
        <div className="relative w-80 h-80 mx-auto mb-12 sm:w-96 sm:h-96">
          <Image
            src="/404.png"
            alt="Näsazlyk ýüze çykdy"
            fill
            className="object-contain opacity-80"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="space-y-6 max-w-lg mx-auto">
          <h1 className="text-5xl font-bold text-foreground">
            Wah, näsazlyk boldy!
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Garaşylmadyk näsazlyk ýüze çykdy. Biraz wagtdan täzeden synanyşmagyňyzy haýyş edýäris.
          </p>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg 
                className="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              Täzeden synanmak
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-foreground bg-muted hover:bg-muted/80 rounded-xl transition-all hover:scale-105"
            >
              <svg 
                className="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              Baş sahypa
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-destructive/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-destructive/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}