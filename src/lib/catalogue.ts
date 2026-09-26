import { minPrice } from "./products";
import type { CategorySlug, CollectionSlug, Product } from "./types";

export const MATERIALS = ["Black", "White", "Brass", "Copper", "Wood", "Glass", "Linen & rope", "Colour"] as const;
export type Material = (typeof MATERIALS)[number];

export function productMaterials(p: Product): Set<Material> {
  const out = new Set<Material>();
  for (const f of p.finishes) {
    for (const k of [f.body, f.trim]) {
      if (k === "black" || k === "anthracite" || k === "charcoal") out.add("Black");
      if (k === "white" || k === "chalk") out.add("White");
      if (k === "brass" || k === "bronze") out.add("Brass");
      if (k === "copper") out.add("Copper");
      if (k === "oak" || k === "walnut") out.add("Wood");
      if (k === "linen" || k === "jute") out.add("Linen & rope");
      if (k === "clay" || k === "sage") out.add("Colour");
    }
    if (f.glass) out.add("Glass");
  }
  if (p.art === "knot") out.add("Linen & rope");
  if (["cloche", "cone", "globe", "teardrop", "orb", "globewall", "disc", "lantern"].includes(p.art)) out.add("Glass");
  return out;
}

export const PRICE_BANDS = [
  { id: "u300", label: "Under $300", min: 0, max: 299 },
  { id: "300-600", label: "$300 – $600", min: 300, max: 600 },
  { id: "600-1000", label: "$600 – $1,000", min: 601, max: 1000 },
  { id: "1000", label: "Over $1,000", min: 1001, max: Infinity },
] as const;

export const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "name", label: "Name, A–Z" },
] as const;
export type SortId = (typeof SORTS)[number]["id"];

export interface Filters {
  category?: CategorySlug;
  collections: CollectionSlug[];
  materials: Material[];
  price: string[];
  tags: ("new" | "bestseller")[];
  sort: SortId;
}

export function parseFilters(sp: URLSearchParams, category?: CategorySlug): Filters {
  const list = (k: string) => (sp.get(k) ?? "").split(",").filter(Boolean);
  const sort = (sp.get("sort") ?? "featured") as SortId;
  return {
    category,
    collections: list("collection") as CollectionSlug[],
    materials: list("material").filter((m): m is Material => (MATERIALS as readonly string[]).includes(m)),
    price: list("price"),
    tags: list("tag") as Filters["tags"],
    sort: SORTS.some((s) => s.id === sort) ? sort : "featured",
  };
}

export function filtersToQuery(f: Filters) {
  const sp = new URLSearchParams();
  if (f.collections.length) sp.set("collection", f.collections.join(","));
  if (f.materials.length) sp.set("material", f.materials.join(","));
  if (f.price.length) sp.set("price", f.price.join(","));
  if (f.tags.length) sp.set("tag", f.tags.join(","));
  if (f.sort !== "featured") sp.set("sort", f.sort);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export const activeCount = (f: Filters) => f.collections.length + f.materials.length + f.price.length + f.tags.length;

export function applyFilters(all: Product[], f: Filters): Product[] {
  let out = all.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    if (f.collections.length && !f.collections.includes(p.collection)) return false;
    if (f.materials.length) {
      const m = productMaterials(p);
      if (!f.materials.some((x) => m.has(x))) return false;
    }
    if (f.price.length) {
      const price = minPrice(p);
      if (!f.price.some((id) => PRICE_BANDS.some((b) => b.id === id && price >= b.min && price <= b.max))) return false;
    }
    if (f.tags.length && !f.tags.some((t) => p.tags.includes(t))) return false;
    return true;
  });
  const score = (p: Product) => (p.tags.includes("featured") ? 2 : 0) + (p.tags.includes("bestseller") ? 1 : 0);
  switch (f.sort) {
    case "price-asc":
      out = [...out].sort((a, b) => minPrice(a) - minPrice(b));
      break;
    case "price-desc":
      out = [...out].sort((a, b) => minPrice(b) - minPrice(a));
      break;
    case "name":
      out = [...out].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "new":
      out = [...out].sort((a, b) => Number(b.tags.includes("new")) - Number(a.tags.includes("new")));
      break;
    default:
      out = [...out].sort((a, b) => score(b) - score(a));
  }
  return out;
}
