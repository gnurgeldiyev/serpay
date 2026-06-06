"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { lifeYears } from "@/lib/utils";

interface PoetCardProps {
	poet: {
		id: string;
		url: string;
		fullname: string;
		avatar?: string;
		birth_date?: string;
		death_date?: string;
		poems_count?: number;
	};
	/** Eager-load + preload this image (use for the first, above-the-fold row). */
	priority?: boolean;
}

function initials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join("");
}

export function PoetCard({ poet, priority = false }: PoetCardProps) {
	const [imageError, setImageError] = useState(false);
	const years = lifeYears(poet.birth_date, poet.death_date);

	return (
		<Link href={`/p/${poet.url}`} className="group block">
			<div className="relative mb-4 aspect-3/4 overflow-hidden rounded-2xl bg-muted ring-1 ring-border/60 transition-all duration-300 group-hover:ring-2 group-hover:ring-primary/40">
				{poet.avatar && !imageError ? (
					<Image
						src={poet.avatar}
						alt={poet.fullname}
						fill
						className="object-cover grayscale-[0.4] transition-all duration-600 ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
						sizes="(max-width: 320px) 40vw, 20vw"
						priority={priority}
						onError={() => setImageError(true)}
					/>
				) : (
					<div className="flex h-full items-center justify-center bg-linear-to-br from-muted to-brand-subtle">
						<span className="font-serif text-4xl font-semibold text-muted-foreground/70">
							{initials(poet.fullname)}
						</span>
					</div>
				)}
				{/* subtle bottom gradient for grounding the image */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/15 to-transparent" aria-hidden="true" />
			</div>

			<h3 className="text-center font-serif text-base font-medium text-foreground transition-colors group-hover:text-primary">
				{poet.fullname}
			</h3>

			{/* animated underline accent */}
			<span
				className="mx-auto mt-1.5 block h-px w-0 bg-primary/50 transition-[width] duration-300 ease-out group-hover:w-8"
				aria-hidden="true"
			/>

			<p className="mt-1.5 text-center text-xs text-muted-foreground">
				{[years, poet.poems_count ? `${poet.poems_count} goşgy` : null]
					.filter(Boolean)
					.join(" · ")}
			</p>
		</Link>
	);
}
