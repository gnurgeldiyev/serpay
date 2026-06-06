"use client";

import Image from "next/image";
import { useState } from "react";

function initials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join("");
}

export function Avatar({
	src,
	name,
	size = 44,
}: {
	src?: string;
	name: string;
	size?: number;
}) {
	const [error, setError] = useState(false);

	return (
		<span
			className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-muted to-brand-subtle ring-1 ring-brand-border"
			style={{ width: size, height: size }}
		>
			{src && !error ? (
				<Image
					src={src}
					alt={name}
					fill
					sizes={`${size}px`}
					className="object-cover"
					onError={() => setError(true)}
				/>
			) : (
				<span className="font-serif text-sm font-semibold text-muted-foreground">
					{initials(name)}
				</span>
			)}
		</span>
	);
}
