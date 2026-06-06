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
}

function initials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join("");
}

export function PoetCard({ poet }: PoetCardProps) {
	const [imageError, setImageError] = useState(false);
	const years = lifeYears(poet.birth_date, poet.death_date);

	return (
		<Link href={`/p/${poet.url}`} className="group block">
			<div className="relative mb-3 aspect-3/4 overflow-hidden rounded-2xl bg-muted ring-1 ring-border/60 transition-shadow duration-300 group-hover:shadow-lg group-hover:ring-primary/30">
				{poet.avatar && !imageError ? (
					<Image
						src={poet.avatar}
						alt={poet.fullname}
						fill
						className="object-cover grayscale-[0.35] transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
						sizes="(max-width: 320px) 40vw, 20vw"
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
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-black/10 to-transparent" aria-hidden="true" />
			</div>

			<h3 className="text-center text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
				{poet.fullname}
			</h3>

			<p className="mt-0.5 text-center text-xs text-muted-foreground">
				{[years, poet.poems_count ? `${poet.poems_count} goşgy` : null]
					.filter(Boolean)
					.join(" · ")}
			</p>
		</Link>
	);
}
