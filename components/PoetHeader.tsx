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

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function PoetHeader({ poet }: PoetHeaderProps) {
  const [imageError, setImageError] = useState(false);

  const dates = poet.birth_date
    ? `${poet.birth_date}${poet.death_date ? ` – ${poet.death_date}` : ""}`
    : poet.death_date
      ? `– ${poet.death_date}`
      : "";

  return (
    <div className="text-center">
      {/* Avatar */}
      <div className="relative mx-auto mb-7 h-40 w-40 overflow-hidden rounded-2xl bg-muted ring-1 ring-border/70 sm:h-48 sm:w-48 md:h-56 md:w-56">
        {poet.avatar && !imageError ? (
          <Image
            src={poet.avatar}
            alt={poet.fullname}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-muted to-brand-subtle">
            <span className="font-serif text-6xl font-semibold text-muted-foreground/70">
              {initials(poet.fullname)}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {poet.fullname}
      </h1>

      {/* Dates / place */}
      {(dates || poet.birth_place) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground sm:text-base">
          {dates && <span>{dates}</span>}
          {dates && poet.birth_place && (
            <span className="h-1 w-1 rotate-45 bg-primary/50" aria-hidden="true" />
          )}
          {poet.birth_place && <span>{poet.birth_place}</span>}
        </div>
      )}

      {/* Bio */}
      {poet.bio && (
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {poet.bio}
        </p>
      )}

      {/* Education */}
      {poet.education && (
        <div className="mt-6">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Bilimi
          </h3>
          <p className="text-sm text-foreground sm:text-base">{poet.education}</p>
        </div>
      )}

      {/* Quote — centered serif pull-quote */}
      {poet.quote && (
        <figure className="relative mx-auto mt-9 max-w-xl">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none font-serif text-6xl leading-none text-brand/15"
          >
            “
          </span>
          <blockquote className="relative font-serif text-lg italic leading-relaxed text-foreground/80 sm:text-xl">
            {poet.quote}
          </blockquote>
        </figure>
      )}
    </div>
  );
}
