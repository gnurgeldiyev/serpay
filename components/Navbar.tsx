"use client";

import Link from "next/link";

export function Navbar() {
	return (
		<nav className="w-full">
			<div className="mx-auto px-4 py-8">
				<div className="text-center">
					<Link href="/" className="inline-block">
						<h1 className="text-4xl font-[family-name:var(--font-inria-serif-bold)]">
							Serpaý
						</h1>
						<p className="text-md text-muted-foreground">Goşgular Çemeni</p>
					</Link>
				</div>
			</div>
		</nav>
	);
}
