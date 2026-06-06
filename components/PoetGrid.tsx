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
			<h2 className="mb-8 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
				Şahyrlar
				<span className="ml-3 align-middle text-base font-sans font-normal text-muted-foreground">
					{poets.length}
				</span>
			</h2>

			<div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{poets.map((poet) => (
					<PoetCard key={poet.id} poet={poet} />
				))}
			</div>
		</div>
	);
}
