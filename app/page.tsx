import { PoetCard } from "@/components/PoetCard";
import { Metadata } from "next";
import dbConnect from "@/lib/db/mongodb";
import { Poet } from "@/lib/db/models";

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

export const revalidate = 3600; // Revalidate every hour

type PoetWithCount = {
	id: string;
	fullname: string;
	url: string;
	avatar?: string;
	birth_date?: string;
	death_date?: string;
	poems_count: number;
}

async function getPoets(): Promise<PoetWithCount[]> {
	try {
		await dbConnect();
		
		const poets = await Poet.aggregate([
			{ $match: { is_deleted: { $ne: true } } },
			{
				$lookup: {
					from: 'poems',
					let: { poetId: '$_id' },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ['$author', '$$poetId'] },
										{ $ne: ['$is_deleted', true] }
									]
								}
							}
						}
					],
					as: 'poems'
				}
			},
			{
				$project: {
					_id: 0,
					id: { $toString: '$_id' },
					fullname: 1,
					url: 1,
					avatar: { $ifNull: ['$avatar', null] },
					birth_date: { $ifNull: ['$birth_date', null] },
					death_date: { $ifNull: ['$death_date', null] },
					poems_count: { $size: '$poems' }
				}
			},
			{ $sort: { fullname: 1 } }
		]);
		
		// Ensure all data is properly serialized as plain objects
		return JSON.parse(JSON.stringify(poets.map(poet => ({
			id: poet.id,
			fullname: poet.fullname,
			url: poet.url,
			avatar: poet.avatar || undefined,
			birth_date: poet.birth_date || undefined,
			death_date: poet.death_date || undefined,
			poems_count: poet.poems_count || 0
		}))));
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
					{poets.map((poet) => (
						<PoetCard key={poet.id} poet={poet} />
					))}
				</div>
			</div>
		</div>
	);
}
