"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { LampArt } from "@/components/lamps/LampArt";
import { productBySlug } from "@/lib/products";
import type { Collection } from "@/lib/types";

const DROPS = [
  { left: "6%", width: "30%", top: "-4%", height: "74%" },
  { left: "35%", width: "32%", top: "6%", height: "86%" },
  { left: "65%", width: "28%", top: "-12%", height: "66%" },
];

/**
 * Large editorial visual for a collection — three of its fixtures at staggered
 * drops. "Deep" collections are shown lit, in their own evening.
 */
export function CollectionScene({ collection, className = "", parallax = true }: { collection: Collection; className?: string; parallax?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);
  const deep = collection.tone === "deep";
  const bg = deep ? "radial-gradient(90% 80% at 50% 30%, #1d1c1b 0%, #121213 70%)" : collection.tone === "stone" ? "var(--surface)" : "var(--bg-2)";

  return (
    <div ref={ref} className={`relative overflow-hidden ${deep ? "lit" : ""} ${className}`} style={{ background: bg }} aria-hidden>
      <motion.div className="absolute inset-0" style={parallax ? { scale } : undefined}>
        {collection.hero.map((slug, i) => {
          const p = productBySlug(slug)!;
          const d = DROPS[i];
          return (
            <div key={slug} className="absolute" style={d}>
              <LampArt art={p.art} finish={p.finishes[0]} cableTop={-3000} align="xMidYMax meet" className="absolute inset-0 h-full w-full" />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
