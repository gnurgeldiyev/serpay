import { PoetGrid } from "@/components/PoetGrid";
import { HomeSearch } from "@/components/HomeSearch";
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

type PopulatedAuthor = { fullname: string; url: string; slug?: string; avatar?: string; is_deleted?: boolean };

/**
 * Deterministic "random" index that rotates once per day (Turkmenistan time).
 * Same day → same index across hourly regenerations; at midnight it advances.
 * A 32-bit bit-mixing hash of the day number gives a well-distributed pick so
 * consecutive days don't land on neighbouring poems.
 */
function dailyIndex(count: number): number {
	const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ashgabat" });
	const dayNumber = Math.floor(Date.parse(`${today}T00:00:00Z`) / 86_400_000);

	let h = dayNumber | 0;
	h = (h ^ 61) ^ (h >>> 16);
	h = h + (h << 3);
	h = h ^ (h >>> 4);
	h = Math.imul(h, 0x27d4eb2d);
	h = h ^ (h >>> 15);

	return (h >>> 0) % count;
}

async function getFeaturedPoem(): Promise<FeaturedPoemData | null> {
	try {
		await dbConnect();

		const filter = { is_deleted: { $ne: true } };
		const select = "title url slug content year author";
		const authorFields = "fullname url slug avatar is_deleted";

		const count = await Poem.countDocuments(filter);
		if (count === 0) return null;

		// Sort by _id so skip(index) maps to a stable poem within the day.
		let poem = await Poem.findOne(filter)
			.sort({ _id: 1 })
			.skip(dailyIndex(count))
			.select(select)
			.populate("author", authorFields)
			.lean();

		let author = poem?.author as PopulatedAuthor | undefined;

		// Fallback to the newest valid poem if that day's pick has no live author.
		if (!poem || !author || author.is_deleted) {
			poem = await Poem.findOne(filter)
				.sort({ created_at: -1 })
				.select(select)
				.populate("author", authorFields)
				.lean();
			author = poem?.author as PopulatedAuthor | undefined;
		}

		if (!poem || !author || author.is_deleted) return null;

		const poetUrl = author.slug || author.url;
		const poemUrl = poem.slug || poem.url;

		return {
			title: poem.title,
			excerpt: excerpt(poem.content, 200),
			poetName: author.fullname,
			poetAvatar: author.avatar || undefined,
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
			<p className="mx-auto mb-14 max-w-2xl text-balance text-center font-serif text-xl leading-relaxed text-foreground/70 sm:text-2xl">
				Türkmen edebiýatynyň klassyk we häzirki zaman şahyrlary, olaryň goşgulary — bir ýerde.
			</p>

			{poets.length > 0 ? (
				<PoetGrid poets={poets} />
			) : (
				<p className="py-16 text-center text-muted-foreground">
					Häzirlikçe şahyr goşulmady.
				</p>
			)}

			<HomeSearch />

			{featured && <FeaturedPoem poem={featured} />}
		</div>
	);
}
