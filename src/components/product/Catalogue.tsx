"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { IconChevron, IconClose, IconFilter } from "@/components/ui/Icons";
import { useFocusTrap } from "@/components/ui/useFocusTrap";
import {
  MATERIALS,
  PRICE_BANDS,
  SORTS,
  activeCount,
  applyFilters,
  filtersToQuery,
  parseFilters,
  type Filters,
  type SortId,
} from "@/lib/catalogue";
import { DESIGN_COLLECTIONS } from "@/lib/collections";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import type { CategorySlug } from "@/lib/types";
import { ProductGrid } from "./ProductGrid";

export function Catalogue({ category }: { category?: CategorySlug }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => parseFilters(new URLSearchParams(sp.toString()), category), [sp, category]);
  const results = useMemo(() => applyFilters(PRODUCTS, filters), [filters]);
  const [open, setOpen] = useState(false);

  const update = (next: Partial<Filters>) => {
    const q = filtersToQuery({ ...filters, ...next });
    router.replace(`${pathname}${q}`, { scroll: false });
  };
  const toggle = <K extends "collections" | "materials" | "price" | "tags">(k: K, v: Filters[K][number]) => {
    const cur = filters[k] as string[];
    update({ [k]: cur.includes(v as string) ? cur.filter((x) => x !== v) : [...cur, v] } as Partial<Filters>);
  };
  const clear = () => update({ collections: [], materials: [], price: [], tags: [] });
  const n = activeCount(filters);

  const chips = [
    ...filters.collections.map((c) => ({ k: "collections" as const, v: c, label: DESIGN_COLLECTIONS.find((x) => x.slug === c)?.name ?? c })),
    ...filters.materials.map((m) => ({ k: "materials" as const, v: m, label: m })),
    ...filters.price.map((p) => ({ k: "price" as const, v: p, label: PRICE_BANDS.find((b) => b.id === p)?.label ?? p })),
    ...filters.tags.map((t) => ({ k: "tags" as const, v: t, label: t === "new" ? "New" : "Best seller" })),
  ];

  return (
    <>
      {/* Category tabs */}
      <nav aria-label="Categories" className="no-scrollbar -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)]">
        <ul className="flex min-w-max gap-7 border-b border-line">
          {[{ slug: undefined, plural: "All lighting" }, ...CATEGORIES].map((c) => {
            const href = c.slug ? `/shop/${c.slug}` : "/shop";
            const active = c.slug === category;
            return (
              <li key={href}>
                <Link
                  href={href + filtersToQuery({ ...filters, category: undefined })}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={`relative block py-4 text-[0.95em] transition-colors ${active ? "text-fg" : "text-fg-3 hover:text-fg"}`}
                >
                  {c.plural}
                  {active && <motion.span layoutId="cat-underline" className="absolute inset-x-0 -bottom-px h-px bg-fg" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toolbar */}
      <div className="sticky top-0 z-20 -mx-[var(--gutter)] mb-6 flex flex-wrap items-center gap-3 bg-bg px-[var(--gutter)] py-4 md:mb-8">
        <button type="button" onClick={() => setOpen(true)} className="btn btn-outline btn-sm gap-2" aria-haspopup="dialog">
          <IconFilter size={16} /> Filter{n > 0 && <span className="t-num">({n})</span>}
        </button>
        <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
          <AnimatePresence initial={false}>
            {chips.map((c) => (
              <motion.button
                layout
                key={`${c.k}-${c.v}`}
                type="button"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.2 }}
                onClick={() => toggle(c.k, c.v as never)}
                className="inline-flex h-9 shrink-0 items-center gap-2 bg-surface px-3 text-[13px]"
                aria-label={`Remove filter ${c.label}`}
              >
                {c.label} <IconClose size={12} />
              </motion.button>
            ))}
          </AnimatePresence>
          {n > 1 && (
            <button type="button" onClick={clear} className="t-caption u-link shrink-0 self-center text-fg-3 hover:text-fg">
              Clear all
            </button>
          )}
        </div>
        <p className="t-small t-num text-fg-3" aria-live="polite">
          {results.length} {results.length === 1 ? "piece" : "pieces"}
        </p>
        <label className="relative inline-flex items-center">
          <span className="sr-only">Sort by</span>
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as SortId })}
            className="h-9 cursor-pointer appearance-none border-0 bg-transparent pr-7 text-[13px] outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <IconChevron size={14} className="pointer-events-none absolute right-0" />
        </label>
      </div>

      {results.length ? (
        <ProductGrid products={results} />
      ) : (
        <div className="flex flex-col items-start gap-5 bg-surface p-10 md:p-16">
          <p className="t-h3">Nothing matches these filters.</p>
          <p className="t-body max-w-[30em]">Try removing a filter, or browse the full catalogue.</p>
          <button type="button" onClick={clear} className="btn btn-solid">
            Clear filters
          </button>
        </div>
      )}

      <FilterDrawer open={open} onClose={() => setOpen(false)} filters={filters} toggle={toggle} clear={clear} count={results.length} />
    </>
  );
}

function FilterDrawer({
  open,
  onClose,
  filters,
  toggle,
  clear,
  count,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  toggle: <K extends "collections" | "materials" | "price" | "tags">(k: K, v: Filters[K][number]) => void;
  clear: () => void;
  count: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Filters" onKeyDown={(e) => e.key === "Escape" && onClose()}>
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label="Close filters"
            className="absolute inset-0 h-full w-full cursor-default"
            style={{ background: "rgba(10,10,12,.32)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36 }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            className="absolute inset-y-0 left-0 flex w-full max-w-[440px] flex-col bg-bg"
            initial={{ x: "-100%" }}
            animate={{ x: 0, transition: { duration: 0.46, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ x: "-100%", transition: { duration: 0.36, ease: [0.65, 0, 0.35, 1] } }}
          >
            <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line px-6 sm:px-8">
              <h2 className="t-caption">Filter</h2>
              <button type="button" onClick={onClose} className="-mr-3 inline-flex h-11 w-11 items-center justify-center" aria-label="Close filters">
                <IconClose />
              </button>
            </div>
            <div className="flex-1 space-y-9 overflow-y-auto px-6 py-8 sm:px-8">
              <Group title="Collection">
                {DESIGN_COLLECTIONS.map((c) => (
                  <Check key={c.slug} label={c.name} hint={c.label} checked={filters.collections.includes(c.slug as never)} onChange={() => toggle("collections", c.slug as never)} />
                ))}
              </Group>
              <Group title="Material">
                {MATERIALS.map((m) => (
                  <Check key={m} label={m} checked={filters.materials.includes(m)} onChange={() => toggle("materials", m)} />
                ))}
              </Group>
              <Group title="Price">
                {PRICE_BANDS.map((b) => (
                  <Check key={b.id} label={b.label} checked={filters.price.includes(b.id)} onChange={() => toggle("price", b.id)} />
                ))}
              </Group>
              <Group title="Edit">
                <Check label="New" checked={filters.tags.includes("new")} onChange={() => toggle("tags", "new")} />
                <Check label="Best sellers" checked={filters.tags.includes("bestseller")} onChange={() => toggle("tags", "bestseller")} />
              </Group>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-line p-6 sm:px-8">
              <button type="button" onClick={clear} className="btn btn-outline">
                Clear
              </button>
              <button type="button" onClick={onClose} className="btn btn-solid">
                Show {count}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="t-caption mb-4 text-fg-3">{title}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function Check({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className="flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-line-strong transition-colors peer-checked:bg-inv peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2"
        aria-hidden
      >
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-inv-fg transition-opacity" style={{ opacity: checked ? 1 : 0 }}>
          <path d="M2 6.5 5 9l5-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
      <span className="flex-1">{label}</span>
      {hint && <span className="t-small text-fg-3">{hint}</span>}
    </label>
  );
}
