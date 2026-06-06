import { PoemSearchBox } from "@/components/PoemSearchBox";

export function HomeSearch() {
	return (
		<section className="mt-20 border-t border-border/70 pt-14">
			<div className="mx-auto max-w-2xl">
				<div className="text-center">
					<div className="mb-5 flex items-center justify-center gap-2" aria-hidden="true">
						<span className="h-px w-8 bg-border" />
						<span className="h-1.5 w-1.5 rotate-45 bg-primary/70" />
						<span className="h-px w-8 bg-border" />
					</div>
					<h3 className="font-serif text-3xl font-bold tracking-tight text-foreground">
						Goşgy gözle
					</h3>
					<p className="mt-3 text-sm text-muted-foreground">
						Goşgynyň ady ýa-da içindäki setir boýunça gözläň
					</p>
				</div>

				<div className="mt-8">
					<PoemSearchBox />
				</div>
			</div>
		</section>
	);
}
