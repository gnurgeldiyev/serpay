import Link from "next/link";

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="mt-20 border-t border-border/70">
			<div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
				<div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
					<Link href="/" className="font-serif text-lg font-bold text-foreground transition-colors hover:text-primary">
						Serpaý
					</Link>

					<p className="text-sm text-muted-foreground">
						Türkmen edebiýatyndan goşgular çemeni
					</p>

					<p className="text-sm text-muted-foreground">
						© {year} ·{" "}
						<a
							href="https://penjire.com"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-foreground transition-colors hover:text-primary"
						>
							Penjire
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
