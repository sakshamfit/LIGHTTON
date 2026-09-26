import type { ArtKey } from "./types";

export interface NavGroup {
  label: string;
  href: string;
  art: ArtKey;
  finish: number;
  links: { label: string; href: string }[];
}

export const NAV: NavGroup[] = [
  { label: "Home", href: "/", art: "vessel", finish: 0, links: [] },
  {
    label: "Shop",
    href: "/shop",
    art: "ora",
    finish: 0,
    links: [
      { label: "All Lighting", href: "/shop" },
      { label: "Pendant", href: "/shop/pendant" },
      { label: "Ceiling", href: "/shop/ceiling" },
      { label: "Table", href: "/shop/table" },
      { label: "Floor", href: "/shop/floor" },
      { label: "Wall", href: "/shop/wall" },
      { label: "Outdoor", href: "/shop/outdoor" },
      { label: "Decorative", href: "/shop/decorative" },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    art: "cage",
    finish: 1,
    links: [
      { label: "New Collection", href: "/collections/nocturne" },
      { label: "Featured", href: "/collections/featured" },
      { label: "Best Sellers", href: "/collections/best-sellers" },
      { label: "Designer Collection", href: "/collections/meridian" },
    ],
  },
  {
    label: "About",
    href: "/about",
    art: "cloche",
    finish: 2,
    links: [
      { label: "Our Story", href: "/about#story" },
      { label: "Design Philosophy", href: "/about#philosophy" },
      { label: "Materials", href: "/about#materials" },
    ],
  },
  { label: "Journal", href: "/journal", art: "arc", finish: 0, links: [] },
  { label: "Contact", href: "/contact", art: "globe", finish: 0, links: [] },
];
