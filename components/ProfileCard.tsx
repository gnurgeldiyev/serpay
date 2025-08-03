'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { User } from 'lucide-react'
import { useState } from 'react'

interface ProfileCardProps {
  data: {
    url: string
    fullname: string
    avatar?: string
  }
  total?: number
}

export function ProfileCard({ data, total = 0 }: ProfileCardProps) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <Link href={`/p/${data.url}`} title={`Şahyr ${data.fullname}`}>
      <Card className="h-20 grid grid-cols-[80px_1fr] overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative w-20 h-full bg-muted flex items-center justify-center">
          {data.avatar && !imageError ? (
            <Image
              src={data.avatar}
              alt={data.fullname}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : null}
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="flex flex-col justify-center px-4">
          <p className="text-sm font-medium text-foreground">
            {data.fullname}
          </p>
          {total > 0 && (
            <p className="text-xs text-muted-foreground">
              {total} goşgy
            </p>
          )}
        </div>
      </Card>
    </Link>
  )
}