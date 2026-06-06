import { PoetGrid } from "@/components/PoetGrid";
import { FeaturedPoem, type FeaturedPoemData } from "@/components/FeaturedPoem";
import { Metadata } from "next";
import dbConnect from "@/lib/db/mongodb";
import { Poet, Poem } from "@/lib/db/models";
import { excerpt } from "@/lib/utils";

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
						},
						{ $project: { _id: 1 } } // Only count, don't fetch full poem data
					],
					as: 'poems'
				}
			},
			{
				$project: {
					_id: 0,
					id: { $toString: '$_id' },
					fullname: 1,
					url: { $ifNull: ['$slug', '$url'] },
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

async function getFeaturedPoem(): Promise<FeaturedPoemData | null> {
	try {
		await dbConnect();

		const poem = await Poem.findOne({ is_deleted: { $ne: true } })
			.sort({ created_at: -1 })
			.select('title url slug content year author')
			.populate('author', 'fullname url slug is_deleted')
			.lean();

		const author = poem?.author as
			| { fullname: string; url: string; slug?: string; is_deleted?: boolean }
			| undefined;

		if (!poem || !author || author.is_deleted) return null;

		const poetUrl = author.slug || author.url;
		const poemUrl = poem.slug || poem.url;

		return {
			title: poem.title,
			excerpt: excerpt(poem.content, 200),
			poetName: author.fullname,
			year: poem.year || undefined,
			href: `/p/${poetUrl}/${poemUrl}`
		};
	} catch (error) {
		console.error("Error fetching featured poem:", error);
		return null;
	}
}

export default async function HomePage() {
	const [poets, featured] = await Promise.all([getPoets(), getFeaturedPoem()]);

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
			<p className="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground">
				Türkmen edebiýatynyň klassyk we häzirki zaman şahyrlary, olaryň goşgulary — bir ýerde.
			</p>

			{featured && <FeaturedPoem poem={featured} />}

			{poets.length > 0 ? (
				<PoetGrid poets={poets} />
			) : (
				<p className="py-16 text-center text-muted-foreground">
					Häzirlikçe şahyr goşulmady.
				</p>
			)}
		</div>
	);
}
