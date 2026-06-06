import Link from "next/link";

export function Navbar() {
	return (
		<nav className="w-full border-b border-border/70">
			<div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
				<Link href="/" className="group mx-auto block w-fit text-center">
					<h1 className="font-serif text-6xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-7xl">
						Serpaý
					</h1>

					<div className="mt-4 flex items-center justify-center gap-3">
						<span className="h-px w-10 bg-border" aria-hidden="true" />
						<span className="h-1.5 w-1.5 rotate-45 bg-primary/70" aria-hidden="true" />
						<span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
							Goşgular Çemeni
						</span>
						<span className="h-1.5 w-1.5 rotate-45 bg-primary/70" aria-hidden="true" />
						<span className="h-px w-10 bg-border" aria-hidden="true" />
					</div>
				</Link>
			</div>
		</nav>
	);
}
