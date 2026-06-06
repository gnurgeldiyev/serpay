import Link from "next/link";

export function Navbar() {
	return (
		<nav className="w-full border-b border-border/70">
			<div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
				<div className="text-center">
					<Link href="/" className="group inline-block">
						<h1 className="font-serif text-5xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-6xl">
							Serpaý
						</h1>
						<span className="mx-auto mt-3 block h-px w-12 bg-primary/60" aria-hidden="true" />
						<p className="mt-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">
							Goşgular Çemeni
						</p>
					</Link>
				</div>
			</div>
		</nav>
	);
}
