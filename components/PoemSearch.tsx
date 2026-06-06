import { PoemSearchBox } from "@/components/PoemSearchBox";

export function PoemSearch({ poetId }: { poetId: string }) {
  return (
    <div className="mx-auto max-w-2xl">
      <PoemSearchBox poetId={poetId} placeholder="Goşgy gözle..." />
    </div>
  );
}
