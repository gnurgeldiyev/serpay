"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PoetCard } from "@/components/PoetCard";
import { slugify } from "@/lib/utils";

type Poet = {
	id: string;
	fullname: string;
	url: string;
	avatar?: string;
	birth_date?: string;
	death_date?: string;
	poems_count: number;
};

export function PoetGrid({ poets }: { poets: Poet[] }) {
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		const q = slugify(query);
		if (!q) return poets;
		return poets.filter((poet) => slugify(poet.fullname).includes(q));
	}, [poets, query]);

	return (
		<div>
			<h2 className="mb-8 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
				Şahyrlar
				<span className="ml-3 align-middle text-base font-sans font-normal text-muted-foreground">
					{poets.length}
				</span>
			</h2>

			{filtered.length > 0 ? (
				<div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{filtered.map((poet) => (
						<PoetCard key={poet.id} poet={poet} />
					))}
				</div>
			) : (
				<p className="py-16 text-center text-muted-foreground">
					“{query}” boýunça şahyr tapylmady.
				</p>
			)}

			<section className="mt-16 border-t border-border/70 pt-12">
				<div className="mx-auto max-w-md text-center">
					<h3 className="font-serif text-2xl font-bold tracking-tight text-foreground">
						Şahyr gözle
					</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Gözleýän şahyryňyzyň adyny ýazyň
					</p>

					<div className="relative mt-6">
						<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Adyny ýazyň..."
							aria-label="Şahyr gözle"
							className="w-full rounded-xl border border-input bg-background py-3 pl-12 pr-4 text-base transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>
				</div>
			</section>
		</div>
	);
}
