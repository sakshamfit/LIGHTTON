import Link from "next/link";
import { LampArt } from "@/components/lamps/LampArt";
import { productBySlug } from "@/lib/products";
import type { Collection } from "@/lib/types";

/** Reference A collection tile: pale field, one hanging fixture, condensed name bottom-left. */
export function CollectionCard({ collection, lead, className = "" }: { collection: Collection; lead?: string; className?: string }) {
  const p = productBySlug(lead ?? collection.hero[1])!;
  return (
    <Link href={`/collections/${collection.slug}`} className={`group relative block overflow-hidden bg-bg-2 ${className}`}>
      <div className="absolute inset-x-[14%] top-0 h-[72%] transition-transform duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-[1.03]">
        <LampArt art={p.art} finish={p.finishes[0]} cableTop={-800} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-[clamp(16px,1.6vw,32px)]">
        <div>
          <p className="t-caption text-fg-3">{collection.label}</p>
          <p className="t-display mt-1.5 text-[clamp(1.6rem,2.3vw,3.4rem)]">{collection.name}</p>
        </div>
        <span className="t-caption translate-x-[-6px] opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          Explore →
        </span>
      </div>
    </Link>
  );
}
