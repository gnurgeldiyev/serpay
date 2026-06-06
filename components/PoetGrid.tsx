import { PoetCard } from "@/components/PoetCard";

type Poet = {
	id: string;
	fullname: string;
	url: string;
	avatar?: string;
	birth_date?: string;
	death_date?: string;
	poems_count: number;
};

export function PoetGrid({ poets }: { poets: Poet[] }) {
	return (
		<div>
			<div className="mb-10 flex items-center gap-3">
				<h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Şahyrlar
				</h2>
				<span className="rounded-full bg-brand-subtle px-2.5 py-0.5 text-sm font-medium text-brand">
					{poets.length}
				</span>
			</div>

			<div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{poets.map((poet) => (
					<PoetCard key={poet.id} poet={poet} />
				))}
			</div>
		</div>
	);
}
