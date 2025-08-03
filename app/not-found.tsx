'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-3xl mx-auto text-center">
        {/* Illustration */}
        <div className="relative w-80 h-80 mx-auto mb-12 sm:w-96 sm:h-96">
          <Image
            src="/404.png"
            alt="Sahypa tapylmady"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="space-y-6 max-w-lg mx-auto">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent mb-4">
            404
          </h1>
          
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Sahypa tapylmady
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Gözlän sahypaňyz tapylmady. Sahypa aýrylan ýa-da başga ýere göçürilen bolmagy mümkin.
          </p>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href="/"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              Baş sahypa
            </Link>
            
            <button
              onClick={() => window.history.back()}
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Yza gaýt
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}