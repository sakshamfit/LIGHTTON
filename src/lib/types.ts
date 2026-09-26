export type CategorySlug =
  | "pendant"
  | "ceiling"
  | "table"
  | "floor"
  | "wall"
  | "outdoor"
  | "decorative";

export type CollectionSlug = "nocturne" | "clarion" | "terra" | "meridian";

export type ArtKey =
  | "ora"
  | "vessel"
  | "cloche"
  | "arc"
  | "cage"
  | "lantern"
  | "knot"
  | "halo"
  | "disc"
  | "cap"
  | "orb"
  | "stem"
  | "tripod"
  | "swing"
  | "globewall"
  | "bollard"
  | "harbour"
  | "globe"
  | "teardrop"
  | "cone";

export type BodyKey =
  | "black"
  | "chalk"
  | "clay"
  | "sage"
  | "brass"
  | "copper"
  | "anthracite"
  | "bronze"
  | "white"
  | "linen"
  | "jute"
  | "charcoal";

export type TrimKey = "oak" | "walnut" | "brass" | "black" | "copper" | "chrome" | "white";

export type GlassKey = "clear" | "smoke" | "amber" | "opal";

export interface Finish {
  id: string;
  name: string;
  body: BodyKey;
  trim: TrimKey;
  glass?: GlassKey;
  /** Colour of the shade interior, visible at the opening. */
  inner?: string;
}

export interface SizeOption {
  id: string;
  label: string;
  /** Short dimension summary for this size. */
  dims: string;
  price: number;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  collection: CollectionSlug;
  art: ArtKey;
  tagline: string;
  description: string;
  story: string;
  tags: ("new" | "bestseller" | "featured")[];
  finishes: Finish[];
  sizes: SizeOption[];
  materials: string[];
  light: {
    source: string;
    output: string;
    temperature: string;
    dimmable: boolean;
  };
  details: { label: string; value: string }[];
  leadTime: string;
  designer: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  plural: string;
  blurb: string;
}

export interface Collection {
  slug: string;
  name: string;
  label: string;
  year: string;
  intro: string;
  story: string[];
  /** Explicit product selection; falls back to collection membership. */
  products?: string[];
  featured: string[];
  hero: string[];
  tone: "pale" | "stone" | "deep";
}

export interface CartLine {
  key: string;
  slug: string;
  finish: string;
  size: string;
  qty: number;
}

export interface JournalEntry {
  slug: string;
  title: string;
  kicker: string;
  date: string;
  readTime: string;
  excerpt: string;
  art: ArtKey[];
  body: ({ type: "p"; text: string } | { type: "h"; text: string } | { type: "quote"; text: string; by?: string })[];
  products: string[];
}
