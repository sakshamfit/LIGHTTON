import Link from "next/link";
import { LampArt } from "@/components/lamps/LampArt";
import { formatDate } from "@/lib/format";
import { PRODUCTS } from "@/lib/products";
import type { ArtKey, JournalEntry } from "@/lib/types";

const finishFor = (art: ArtKey) => PRODUCTS.find((p) => p.art === art)!.finishes[0];

/** Editorial still life — three fixtures at staggered drops. */
export function JournalScene({ arts, className = "", lit = false }: { arts: ArtKey[]; className?: string; lit?: boolean }) {
  const drops = ["-6%", "10%", "-14%"];
  return (
    <div className={`relative overflow-hidden bg-bg-2 ${lit ? "lit" : ""} ${className}`} aria-hidden>
      {arts.slice(0, 3).map((a, i) => (
        <div key={i} className="absolute h-[82%] w-[40%]" style={{ left: `${4 + i * 28}%`, top: drops[i] }}>
          <LampArt art={a} finish={finishFor(a)} cableTop={-1200} className="absolute inset-0 h-full w-full" />
        </div>
      ))}
    </div>
  );
}

export function JournalCard({ entry, large = false }: { entry: JournalEntry; large?: boolean }) {
  return (
    <Link href={`/journal/${entry.slug}`} className="group block">
      <div className="overflow-hidden">
        <JournalScene
          arts={entry.art}
          className={`transition-transform duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-[1.03] ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}
        />
      </div>
      <div className="mt-5 flex items-center gap-3 text-fg-3">
        <span className="t-caption">{entry.kicker}</span>
        <span className="h-px w-5 bg-line-strong opacity-40" />
        <time className="t-small" dateTime={entry.date}>
          {formatDate(entry.date)}
        </time>
      </div>
      <h3 className={`${large ? "t-h2" : "t-h3"} mt-3 max-w-[18em] transition-opacity group-hover:opacity-70`}>{entry.title}</h3>
      <p className="t-body mt-3 max-w-[32em]">{entry.excerpt}</p>
    </Link>
  );
}
