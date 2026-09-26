import { PRODUCTS, hasTag } from "./products";
import type { Collection, Product } from "./types";

export const COLLECTIONS: Collection[] = [
  {
    slug: "nocturne",
    name: "Nocturne",
    label: "New Collection",
    year: "2026",
    intro: "Dark metals, low light, long evenings.",
    story: [
      "Nocturne is a collection drawn after sunset. Blackened steel, enamel and beaten brass: surfaces that almost vanish in the dark, so the light is all that remains.",
      "Every piece is designed around a visible source — a filament, a glow at the throat of a shade — because at night the source is the ornament.",
    ],
    featured: ["vessel-pendant", "arc-shade"],
    hero: ["arc-shade", "vessel-pendant", "frame-lantern"],
    tone: "deep",
  },
  {
    slug: "clarion",
    name: "Clarion",
    label: "Glass",
    year: "2025",
    intro: "Mouth-blown glass. Clear, opal, amber.",
    story: [
      "Clarion is a study of glass in three states: clear enough to reveal the filament, cased opal to hide it, and amber to warm it.",
      "The pieces are blown in a small Bohemian glassworks where every mould is still carved from beechwood.",
    ],
    featured: ["cloche-pendant", "orb-table-lamp"],
    hero: ["cone-glass-pendant", "cloche-pendant", "globe-filament"],
    tone: "pale",
  },
  {
    slug: "terra",
    name: "Terra",
    label: "Wood & Earth",
    year: "2025",
    intro: "Oak, linen, jute and earth pigments.",
    story: [
      "Terra brings the warmth of natural materials into architectural form: turned oak, woven linen, earth-pigment lacquers.",
      "These are lamps that soften a room even when switched off — and age more beautifully every year.",
    ],
    featured: ["ora-pendant", "tripod-floor-lamp"],
    hero: ["knot-pendant", "ora-pendant", "cap-table-lamp"],
    tone: "stone",
  },
  {
    slug: "meridian",
    name: "Meridian",
    label: "Designer Collection",
    year: "2026",
    intro: "By Ines Aldana. Lines of light.",
    story: [
      "Meridian is our designer collection with Lisbon-based Ines Aldana. Her work treats a lamp as a drawing in space — wire, ring, arm — with light as the point of the pen.",
      "Each piece is made to order and signed on the canopy.",
    ],
    featured: ["halo-ring", "cage-globe"],
    hero: ["cage-globe", "halo-ring", "swing-sconce"],
    tone: "pale",
  },
  {
    slug: "featured",
    name: "Featured",
    label: "Curated",
    year: "2026",
    intro: "The pieces we would hang first.",
    story: [
      "A short edit across every collection: the fixtures our studio returns to, project after project.",
    ],
    products: hasTag("featured").map((p) => p.slug),
    featured: ["ora-pendant", "cloche-pendant"],
    hero: ["cloche-pendant", "ora-pendant", "cage-globe"],
    tone: "pale",
  },
  {
    slug: "best-sellers",
    name: "Best Sellers",
    label: "Most loved",
    year: "2026",
    intro: "The fixtures our clients reorder.",
    story: [
      "Chosen by the people who live with them. These are the pieces most often ordered twice — for a second room, or a second home.",
    ],
    products: hasTag("bestseller").map((p) => p.slug),
    featured: ["vessel-pendant", "cap-table-lamp"],
    hero: ["arc-shade", "vessel-pendant", "harbour-lantern"],
    tone: "stone",
  },
];

/** Collections shown as true design lines (not curated edits). */
export const DESIGN_COLLECTIONS = COLLECTIONS.filter((c) => !c.products);

export const collectionBySlug = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);

export function collectionProducts(c: Collection): Product[] {
  if (c.products) return c.products.map((s) => PRODUCTS.find((p) => p.slug === s)!).filter(Boolean);
  return PRODUCTS.filter((p) => p.collection === c.slug);
}
