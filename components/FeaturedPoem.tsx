import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type FeaturedPoemData = {
	title: string;
	excerpt: string;
	poetName: string;
	href: string;
	year?: string;
};

export function FeaturedPoem({ poem }: { poem: FeaturedPoemData }) {
	return (
		<section className="mb-16">
			<Link
				href={poem.href}
				className="group relative block overflow-hidden rounded-3xl border border-brand-border bg-brand-subtle px-6 py-10 transition-shadow duration-300 hover:shadow-lg sm:px-12 sm:py-14"
			>
				<p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-brand">
					Saýlanan goşgy
				</p>

				<h2 className="font-serif text-2xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-3xl">
					{poem.title}
				</h2>

				{poem.excerpt && (
					<p className="mt-4 max-w-2xl whitespace-pre-line font-serif text-lg leading-relaxed text-foreground/80">
						{poem.excerpt}
					</p>
				)}

				<div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
					<span className="font-medium text-foreground">{poem.poetName}</span>
					{poem.year && <span>· {poem.year}</span>}
					<span className="ml-auto inline-flex items-center gap-1 font-medium text-brand">
						Doly oka
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</span>
				</div>
			</Link>
		</section>
	);
}
