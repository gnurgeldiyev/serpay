"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface PoetCardProps {
	poet: {
		id: string;
		url: string;
		fullname: string;
		avatar?: string;
	};
}

export function PoetCard({ poet }: PoetCardProps) {
	const [imageError, setImageError] = useState(false);

	return (
		<Link href={`/p/${poet.url}`} className="group block">
			<div className="relative aspect-[3/4] mb-3 overflow-hidden rounded-2xl bg-muted">
				{poet.avatar && !imageError ? (
					<Image
						src={poet.avatar}
						alt={poet.fullname}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 320px) 40vw, 20vw"
						onError={() => setImageError(true)}
					/>
				) : (
					<div className="flex h-full items-center justify-center bg-muted">
						<span className="text-6xl text-muted-foreground">👤</span>
					</div>
				)}
			</div>
			<h3 className="text-center text-sm font-medium text-foreground group-hover:text-muted-foreground transition-colors">
				{poet.fullname}
			</h3>
		</Link>
	);
}
