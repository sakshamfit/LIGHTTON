import { COLLECTIONS } from "./collections";
import { CATEGORIES, PRODUCTS } from "./products";
import type { Product } from "./types";

/** Words people use that map onto catalogue terms. */
const SYNONYMS: Record<string, string[]> = {
  pendant: ["hanging", "suspended", "suspension", "drop"],
  ceiling: ["chandelier", "flush", "overhead"],
  table: ["desk", "bedside", "lamp"],
  floor: ["standing", "reading"],
  wall: ["sconce", "bracket"],
  outdoor: ["garden", "exterior", "path", "porch", "bollard"],
  decorative: ["bulb", "filament", "edison"],
  glass: ["clear", "opal", "amber", "smoke"],
  brass: ["gold", "metal"],
  oak: ["wood", "walnut", "timber"],
};

function haystack(p: Product) {
  const cat = CATEGORIES.find((c) => c.slug === p.category)!;
  const col = COLLECTIONS.find((c) => c.slug === p.collection);
  const words = [
    p.name,
    p.tagline,
    cat.name,
    cat.plural,
    col?.name ?? "",
    col?.label ?? "",
    p.designer,
    ...p.finishes.map((f) => f.name),
    ...p.materials,
    ...p.tags,
  ];
  for (const [key, syns] of Object.entries(SYNONYMS)) {
    if (words.some((w) => w.toLowerCase().includes(key))) words.push(...syns);
  }
  return words.join(" ").toLowerCase();
}

const INDEX = PRODUCTS.map((p) => ({ p, text: haystack(p), name: p.name.toLowerCase(), cat: p.category }));

/**
 * Token search: every token must appear somewhere; name and category hits rank higher.
 */
export function searchProducts(query: string): Product[] {
  const tokens = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => (t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t));
  if (!tokens.length) return [];
  return INDEX.map(({ p, text, name, cat }) => {
    let score = 0;
    for (const t of tokens) {
      if (!text.includes(t)) return { p, score: -1 };
      if (name.startsWith(t)) score += 6;
      else if (name.includes(t)) score += 4;
      if (cat.startsWith(t)) score += 3;
      score += 1;
    }
    return { p, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}

export const POPULAR_SEARCHES = ["Pendant", "Brass", "Glass", "Table lamp", "Outdoor", "Oak"];
