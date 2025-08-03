"use client";

import Image from "next/image";
import { useState } from "react";

interface PoetHeaderProps {
  poet: {
    id: string;
    fullname: string;
    url: string;
    bio?: string;
    birth_date?: string;
    death_date?: string;
    birth_place?: string;
    education?: string;
    quote?: string;
    avatar?: string;
  };
}

export function PoetHeader({ poet }: PoetHeaderProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="text-center">
      {/* Avatar - Centered and responsive */}
      <div className="mx-auto mb-6">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 overflow-hidden rounded-2xl bg-muted mx-auto shadow-lg">
          {poet.avatar && !imageError ? (
            <Image
              src={poet.avatar}
              alt={poet.fullname}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-6xl sm:text-7xl md:text-8xl text-muted-foreground">👤</span>
            </div>
          )}
        </div>
      </div>

      {/* Info - All centered below avatar */}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-[family-name:var(--font-inria-serif-bold)] mb-4">
          {poet.fullname}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm sm:text-base text-muted-foreground mb-6">
          {poet.birth_date && (
            <span>
              {poet.birth_date}
              {poet.death_date && ` – ${poet.death_date}`}
            </span>
          )}
          {poet.birth_place && poet.birth_date && (
            <span className="hidden sm:inline">•</span>
          )}
          {poet.birth_place && (
            <span>{poet.birth_place}</span>
          )}
        </div>

        {poet.bio && (
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground mb-6 max-w-2xl mx-auto">
            {poet.bio}
          </p>
        )}

        {poet.education && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Bilimi</h3>
            <p className="text-sm sm:text-base text-foreground">{poet.education}</p>
          </div>
        )}

        {poet.quote && (
          <blockquote className="max-w-xl mx-auto border-l-4 border-primary pl-4 py-2 italic text-sm sm:text-base lg:text-lg text-muted-foreground text-left">
            "{poet.quote}"
          </blockquote>
        )}
      </div>
    </div>
  );
}