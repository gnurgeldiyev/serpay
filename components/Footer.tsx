import Link from "next/link";

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="mt-24 border-t border-border/70 bg-linear-to-b from-background to-brand-subtle/40">
			<div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
				<div className="flex flex-col items-center text-center">
					{/* Brand bookend — mirrors the masthead */}
					<Link href="/" className="group inline-block">
						<span className="font-serif text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
							Serpaý
						</span>
					</Link>

					<div className="mt-3 flex items-center justify-center gap-2.5" aria-hidden="true">
						<span className="h-px w-6 bg-border" />
						<span className="h-1 w-1 rotate-45 bg-primary/70" />
						<span className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
							Goşgular Çemeni
						</span>
						<span className="h-1 w-1 rotate-45 bg-primary/70" />
						<span className="h-px w-6 bg-border" />
					</div>

					{/* Copyright */}
					<div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
						<span>© 2018–{year}</span>
						<span className="text-border">·</span>
						<a
							href="https://penjire.com"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-foreground transition-colors hover:text-primary"
						>
							Penjire
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
