import { LampArt, ART_META } from "@/components/lamps/LampArt";
import type { Finish, Product } from "@/lib/types";

/**
 * Framed product render. Pendants hang from the top edge (cable runs out of
 * frame); standing and wall pieces sit on their natural baseline.
 */
export function ProductThumb({
  product,
  finish,
  className = "",
  tone = "surface",
  pad = "normal",
}: {
  product: Product;
  finish?: Finish;
  className?: string;
  tone?: "surface" | "bg-2" | "panel" | "none";
  pad?: "tight" | "normal" | "loose";
}) {
  const mount = ART_META[product.art].mount;
  const f = finish ?? product.finishes[0];
  const bg = tone === "none" ? "" : tone === "surface" ? "bg-surface" : tone === "bg-2" ? "bg-bg-2" : "bg-panel";
  const inset = pad === "tight" ? 6 : pad === "loose" ? 16 : 10;
  const pos =
    mount === "ceiling"
      ? { top: 0, height: `${100 - inset}%` }
      : { bottom: `${inset * 0.6}%`, height: `${100 - inset * 1.8}%` };
  return (
    <div className={`relative overflow-hidden ${bg} ${className}`}>
      <LampArt
        art={product.art}
        finish={f}
        cableTop={mount === "ceiling" ? -600 : 0}
        className="absolute"
        style={{ left: `${inset}%`, width: `${100 - inset * 2}%`, ...pos }}
        title={`${product.name}, ${f.name}`}
      />
    </div>
  );
}
