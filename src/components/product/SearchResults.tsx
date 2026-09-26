"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import { IconSearch } from "@/components/ui/Icons";
import { CATEGORIES } from "@/lib/products";
import { POPULAR_SEARCHES, searchProducts } from "@/lib/search";
import { ProductGrid } from "./ProductGrid";

export function SearchResults() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const deferred = useDeferredValue(q);
  const results = useMemo(() => searchProducts(deferred), [deferred]);

  const commit = (v: string) => {
    setQ(v);
    router.replace(v.trim() ? `${pathname}?q=${encodeURIComponent(v.trim())}` : pathname, { scroll: false });
  };

  return (
    <>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          commit(q);
        }}
        className="flex items-center gap-4 border-b border-line-strong pb-3"
      >
        <IconSearch size={26} className="shrink-0 text-fg-3" />
        <input
          value={q}
          onChange={(e) => commit(e.target.value)}
          placeholder="Search lighting"
          aria-label="Search products"
          className="w-full bg-transparent text-[clamp(1.6rem,3.2vw,3.2rem)] font-light tracking-[-0.02em] outline-none placeholder:text-fg-3/60 focus-visible:outline-none"
          autoComplete="off"
        />
      </form>
      <p className="t-small t-num mt-4 text-fg-3" aria-live="polite">
        {deferred.trim() ? `${results.length} result${results.length === 1 ? "" : "s"} for “${deferred.trim()}”` : "Type to search the catalogue."}
      </p>

      <div className="mt-10">
        {deferred.trim() && results.length > 0 && <ProductGrid products={results} />}
        {deferred.trim() && results.length === 0 && (
          <div className="bg-surface p-10 md:p-14">
            <p className="t-h3">No fixtures match “{deferred.trim()}”.</p>
            <p className="t-body mt-2">Try a type of light, a material or a collection.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((s) => (
                <button key={s} type="button" onClick={() => commit(s)} className="h-10 border border-line px-4 text-sm hover:border-line-strong">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {!deferred.trim() && (
          <ul className="grid grid-cols-2 gap-y-3 md:grid-cols-4">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="u-link text-fg-2 hover:text-fg">
                  {c.plural}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
