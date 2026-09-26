"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import { LampArt } from "@/components/lamps/LampArt";
import { IconArrowLong, IconClose, IconSearch } from "@/components/ui/Icons";
import { useFocusTrap } from "@/components/ui/useFocusTrap";
import { money } from "@/lib/format";
import { CATEGORIES, minPrice } from "@/lib/products";
import { POPULAR_SEARCHES, searchProducts } from "@/lib/search";
import { useUI } from "./UIProvider";

export function SearchOverlay() {
  const { panel, close } = useUI();
  const isOpen = panel === "search";
  return <AnimatePresence>{isOpen && <SearchPanel onClose={close} />}</AnimatePresence>;
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(-1);
  const deferred = useDeferredValue(q);
  const results = useMemo(() => searchProducts(deferred), [deferred]);
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useFocusTrap(ref, true, input);

  const shown = results.slice(0, 6);
  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(shown.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(-1, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (cursor >= 0 && shown[cursor]) go(`/product/${shown[cursor].slug}`);
      else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[70]" ref={ref} role="dialog" aria-modal="true" aria-label="Search">
      <motion.button
        type="button"
        aria-label="Close search"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full cursor-default"
        style={{ background: "color-mix(in srgb, var(--bg) 40%, rgba(10,10,12,.45))" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />
      <motion.div
        className="relative max-h-[100dvh] overflow-y-auto bg-bg shadow-[0_30px_80px_-40px_rgba(0,0,0,.35)]"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16, transition: { duration: 0.28, ease: [0.55, 0, 1, 0.45] } }}
        transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="wrap pb-10 pt-5 md:pb-14 md:pt-8">
          <div className="flex items-center justify-between">
            <span className="t-caption text-fg-3">Search</span>
            <button type="button" onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center" aria-label="Close search">
              <IconClose />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-4 border-b border-line-strong pb-3">
            <IconSearch size={26} className="shrink-0 text-fg-3" />
            <input
              ref={input}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setCursor(-1);
              }}
              onKeyDown={onKey}
              placeholder="Pendant, brass, glass…"
              aria-label="Search products"
              aria-controls="search-results"
              aria-activedescendant={cursor >= 0 ? `sr-${cursor}` : undefined}
              className="w-full bg-transparent text-[clamp(1.6rem,3.6vw,3.6rem)] font-light tracking-[-0.02em] outline-none placeholder:text-fg-3/60 focus-visible:outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            {q && (
              <button type="button" className="t-caption shrink-0 text-fg-3 hover:text-fg" onClick={() => setQ("")}>
                Clear
              </button>
            )}
          </div>

          <div id="search-results" className="mt-8 min-h-[180px]" aria-live="polite">
            {!deferred.trim() ? (
              <div className="grid gap-10 md:grid-cols-2">
                <div>
                  <p className="t-caption mb-4 text-fg-3">Popular</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQ(s)}
                        className="h-10 border border-line px-4 text-sm transition-colors hover:border-line-strong"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="t-caption mb-4 text-fg-3">Browse</p>
                  <ul className="grid grid-cols-2 gap-y-2">
                    {CATEGORIES.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/shop/${c.slug}`} onClick={onClose} className="u-link text-fg-2 hover:text-fg">
                          {c.plural}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-6">
                <p className="t-h3">No fixtures match “{deferred}”.</p>
                <p className="t-body mt-2">Try a type of light, a material or a collection — for example “pendant”, “oak” or “Nocturne”.</p>
              </div>
            ) : (
              <>
                <p className="t-caption mb-5 text-fg-3">
                  {results.length} result{results.length === 1 ? "" : "s"}
                </p>
                <ul className="grid gap-x-8 gap-y-1 md:grid-cols-2" role="listbox" aria-label="Results">
                  {shown.map((p, i) => (
                    <li key={p.slug} id={`sr-${i}`} role="option" aria-selected={cursor === i}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={onClose}
                        onMouseEnter={() => setCursor(i)}
                        className="group flex items-center gap-5 py-2.5"
                      >
                        <span className="relative block h-20 w-16 shrink-0 overflow-hidden bg-surface transition-colors" style={{ background: cursor === i ? "var(--bg-2)" : undefined }}>
                          <LampArt art={p.art} finish={p.finishes[0]} cableTop={-200} className="absolute inset-x-[8%] top-[6%] h-[88%] w-[84%]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[1.05em]">{p.name}</span>
                          <span className="t-small block text-fg-3">{CATEGORIES.find((c) => c.slug === p.category)?.name}</span>
                        </span>
                        <span className="t-num t-small text-fg-2">{money(minPrice(p))}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => go(`/search?q=${encodeURIComponent(deferred.trim())}`)}
                  className="u-link t-caption mt-8 inline-flex items-center gap-3"
                >
                  View all results <IconArrowLong size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
