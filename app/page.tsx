import { PoetCard } from "@/components/PoetCard";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Serpaý – Goşgular Çemeni",
	description: "Türkmen edebiýatyndan goşgular çemeni. Klassyk we häzirki zaman şahyrlarynyň eserleri.",
	openGraph: {
		title: "Serpaý – Goşgular Çemeni",
		description: "Türkmen edebiýatyndan goşgular çemeni. Klassyk we häzirki zaman şahyrlarynyň eserleri.",
		type: "website",
		siteName: "Serpaý",
		locale: "tk_TM",
		url: "https://serpay.penjire.com"
	},
	twitter: {
		card: "summary_large_image",
		title: "Serpaý – Goşgular Çemeni",
		description: "Türkmen edebiýatyndan goşgular çemeni"
	},
	keywords: [
		"türkmen goşgy",
		"türkmen edebiýaty",
		"türkmen şahyrlary",
		"goşgular",
		"serpaý"
	]
};

async function getPoets() {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/poets`,
			{
				next: { revalidate: 3600 } // Revalidate every hour
			},
		);
		if (!res.ok) throw new Error("Failed to fetch");
		return res.json();
	} catch (error) {
		console.error("Error fetching poets:", error);
		return [];
	}
}

export default async function HomePage() {
	const poets = await getPoets();

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
			<div className="mx-auto max-w-2xl lg:max-w-none">
				<h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl mb-6 md:mb-12">
					Şahyrlar
				</h2>

				<div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{poets.map((poet: any) => (
						<PoetCard key={poet.id} poet={poet} />
					))}
				</div>
			</div>
		</div>
	);
}
