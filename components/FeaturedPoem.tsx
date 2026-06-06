import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export type FeaturedPoemData = {
	title: string;
	excerpt: string;
	poetName: string;
	poetAvatar?: string;
	href: string;
	year?: string;
};

export function FeaturedPoem({ poem }: { poem: FeaturedPoemData }) {
	return (
		<section className="mt-16">
			<Link
				href={poem.href}
				className="group relative block overflow-hidden rounded-3xl border border-brand-border bg-linear-to-br from-brand-subtle via-background to-brand-subtle/50 px-6 py-10 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:px-14 sm:py-16"
			>
				{/* Decorative quotation watermark */}
				<span
					aria-hidden="true"
					className="pointer-events-none absolute -right-3 -top-12 select-none font-serif text-[12rem] leading-none text-brand/[0.07] transition-transform duration-500 group-hover:scale-105 sm:text-[17rem]"
				>
					“
				</span>

				{/* Eyebrow */}
				<div className="relative mb-7 flex items-center gap-3">
					<Sparkles className="h-4 w-4 text-brand" />
					<span className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
						Günüň goşgusy
					</span>
					<span className="h-px flex-1 bg-brand-border" />
				</div>

				{/* Title */}
				<h2 className="relative font-serif text-3xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-4xl">
					{poem.title}
				</h2>

				{/* Excerpt as a blockquote */}
				{poem.excerpt && (
					<p className="relative mt-6 max-w-2xl whitespace-pre-line border-l-2 border-brand/30 pl-5 font-serif text-lg italic leading-relaxed text-foreground/75 sm:text-xl">
						{poem.excerpt}
					</p>
				)}

				{/* Footer: poet + CTA */}
				<div className="relative mt-9 flex items-center gap-3">
					<Avatar src={poem.poetAvatar} name={poem.poetName} />
					<div className="min-w-0">
						<p className="truncate font-medium text-foreground">{poem.poetName}</p>
						{poem.year && (
							<p className="text-sm text-muted-foreground">{poem.year}</p>
						)}
					</div>

					<span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand/40 bg-background/60 px-4 py-2 text-sm font-medium text-brand transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
						Doly oka
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</span>
				</div>
			</Link>
		</section>
	);
}
