"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

type Result = {
	id: string;
	title: string;
	poetName: string;
	year?: string;
	href: string;
	matchedIn: "title" | "content";
	snippet?: string;
};

function escapeRegex(input: string): string {
	return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Render `text` with every (case-insensitive) occurrence of `query` highlighted. */
function Highlight({ text, query }: { text: string; query: string }) {
	const q = query.trim();
	if (!q) return <>{text}</>;

	const parts = text.split(new RegExp(`(${escapeRegex(q)})`, "gi"));
	return (
		<>
			{parts.map((part, i) =>
				part.toLowerCase() === q.toLowerCase() ? (
					<mark
						key={i}
						className="rounded-sm bg-brand/15 px-0.5 font-semibold text-brand"
					>
						{part}
					</mark>
				) : (
					part
				)
			)}
		</>
	);
}

export function HomeSearch() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Result[]>([]);
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);

	const trimmed = query.trim();

	useEffect(() => {
		const controller = new AbortController();

		// All state updates live inside async callbacks (timer / fetch) so the
		// effect body never updates state synchronously.
		const timer = setTimeout(async () => {
			if (trimmed.length < 2) {
				setResults([]);
				setSearched(false);
				setLoading(false);
				return;
			}

			setLoading(true);
			try {
				const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
					signal: controller.signal,
				});
				const data = await res.json();
				setResults(data.results ?? []);
				setSearched(true);
			} catch {
				if (!controller.signal.aborted) {
					setResults([]);
					setSearched(true);
				}
			} finally {
				if (!controller.signal.aborted) setLoading(false);
			}
		}, trimmed.length < 2 ? 0 : 250);

		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [trimmed]);

	const showResults = trimmed.length >= 2 && results.length > 0;
	const showEmpty =
		trimmed.length >= 2 && !loading && searched && results.length === 0;

	// Apple-like: gentle spring for position/size, quick fade for opacity.
	const spring = { type: "spring", stiffness: 520, damping: 42, mass: 1 } as const;

	return (
		<MotionConfig reducedMotion="user">
			<section className="mt-16 border-t border-border/70 pt-12">
				<div className="mx-auto max-w-2xl">
					<div className="text-center">
						<h3 className="font-serif text-2xl font-bold tracking-tight text-foreground">
							Goşgy gözle
						</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							Goşgynyň ady ýa-da içindäki setir boýunça gözläň
						</p>
					</div>

					<div className="relative mx-auto mt-6 max-w-md">
						<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Goşgynyň adyny ýa-da bir setirini ýazyň..."
							aria-label="Goşgy gözle"
							className="w-full rounded-xl border border-input bg-background py-3 pl-12 pr-11 text-base transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
						<AnimatePresence>
							{loading && (
								<motion.span
									key="spinner"
									initial={{ opacity: 0, scale: 0.6 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.6 }}
									transition={{ duration: 0.18 }}
									className="absolute right-4 top-1/2 -translate-y-1/2"
								>
									<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
								</motion.span>
							)}
						</AnimatePresence>
					</div>

					{/* Layout-animated container so height changes glide instead of jumping. */}
					<motion.div layout transition={{ layout: spring }} className="overflow-hidden">
						<ul className="mt-8 divide-y divide-border">
							<AnimatePresence mode="popLayout" initial={false}>
								{showResults &&
									results.map((r, i) => (
										<motion.li
											key={r.id}
											layout
											initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
											animate={{
												opacity: 1,
												y: 0,
												filter: "blur(0px)",
												transition: {
													...spring,
													delay: Math.min(i, 8) * 0.035,
													opacity: { duration: 0.25, delay: Math.min(i, 8) * 0.035 },
												},
											}}
											exit={{
												opacity: 0,
												y: -8,
												filter: "blur(3px)",
												transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
											}}
										>
											<Link
												href={r.href}
												className="group block py-4 transition-colors"
											>
												<div className="flex items-baseline justify-between gap-3">
													<h4 className="font-serif text-lg font-medium text-foreground transition-colors group-hover:text-primary">
														<Highlight text={r.title} query={trimmed} />
													</h4>
													<span className="shrink-0 text-sm text-muted-foreground">
														{r.poetName}
														{r.year ? ` · ${r.year}` : ""}
													</span>
												</div>
												{r.matchedIn === "content" && r.snippet && (
													<p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
														<Highlight text={r.snippet} query={trimmed} />
													</p>
												)}
											</Link>
										</motion.li>
									))}
							</AnimatePresence>
						</ul>

						<AnimatePresence initial={false}>
							{showEmpty && (
								<motion.p
									key="empty"
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -4 }}
									transition={{ duration: 0.22 }}
									className="py-8 text-center text-muted-foreground"
								>
									“{trimmed}” boýunça goşgy tapylmady.
								</motion.p>
							)}
						</AnimatePresence>
					</motion.div>
				</div>
			</section>
		</MotionConfig>
	);
}
