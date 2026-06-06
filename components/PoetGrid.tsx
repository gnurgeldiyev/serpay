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
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Şahyrlar
					<span className="ml-3 align-middle text-base font-sans font-normal text-muted-foreground">
						{poets.length}
					</span>
				</h2>

				<div className="relative w-full sm:max-w-xs">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Şahyr gözle..."
						aria-label="Şahyr gözle"
						className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					/>
				</div>
			</div>

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
		</div>
	);
}
