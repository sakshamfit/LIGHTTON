import Link from "next/link";
import { CATEGORIES } from "@/lib/products";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

const COLS = [
  {
    title: "Shop",
    links: [["All lighting", "/shop"], ...CATEGORIES.slice(0, 5).map((c) => [c.plural, `/shop/${c.slug}`])],
  },
  {
    title: "Collections",
    links: [
      ["Nocturne", "/collections/nocturne"],
      ["Clarion", "/collections/clarion"],
      ["Terra", "/collections/terra"],
      ["Meridian", "/collections/meridian"],
      ["Best sellers", "/collections/best-sellers"],
    ],
  },
  {
    title: "Studio",
    links: [
      ["About", "/about"],
      ["Journal", "/journal"],
      ["Contact", "/contact"],
      ["Delivery & returns", "/contact#delivery"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <Logo />
          <p className="t-lead mt-6 max-w-[22em] text-fg-2">Architectural lighting, designed for the day it hangs in and the night it creates.</p>
          <NewsletterForm />
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="t-caption mb-5 text-fg-3">{c.title}</p>
              <ul className="space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="u-link text-fg-2 transition-colors hover:text-fg">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="wrap flex flex-col gap-3 border-t border-line py-6 text-fg-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-small">© {new Date().getFullYear()} Vesper Lighting Studio. Prototype storefront — no real orders are processed.</p>
        <ul className="t-caption flex gap-6">
          {["Instagram", "Pinterest", "Journal"].map((s) => (
            <li key={s}>
              {s === "Journal" ? (
                <Link href="/journal" className="u-link hover:text-fg">
                  {s}
                </Link>
              ) : (
                <a href={`https://www.${s.toLowerCase()}.com/`} target="_blank" rel="noreferrer noopener" className="u-link hover:text-fg">
                  {s}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
