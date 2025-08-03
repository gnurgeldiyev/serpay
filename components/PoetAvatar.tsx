'use client'

import Image from 'next/image'
import { useState } from 'react'

interface PoetAvatarProps {
  src?: string
  alt: string
}

export function PoetAvatar({ src, alt }: PoetAvatarProps) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : null}
      <svg 
        className="w-24 h-24 text-muted-foreground" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
        />
      </svg>
    </div>
  )
}