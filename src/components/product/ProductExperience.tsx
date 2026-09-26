"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { QtyStepper } from "@/components/cart/QtyStepper";
import { useCart } from "@/components/cart/CartProvider";
import { useUI } from "@/components/layout/UIProvider";
import { LampArt } from "@/components/lamps/LampArt";
import { BODY, GLASS, TRIM } from "@/components/lamps/materials";
import { IconCheck } from "@/components/ui/Icons";
import { money } from "@/lib/format";
import type { Finish, Product } from "@/lib/types";
import { ProductGallery, type ViewId } from "./ProductGallery";

const reveal = (delay: number, y = 10, duration = 0.55) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0, transition: { duration, delay, ease: [0.22, 0.61, 0.36, 1] as const } },
});

function Swatch({ f }: { f: Finish }) {
  const a = f.glass ? (f.glass === "opal" ? "#f1f2f3" : GLASS[f.glass].edge) : BODY[f.body][2];
  const b = TRIM[f.trim][2];
  return (
    <span className="block h-full w-full rounded-full" style={{ background: `linear-gradient(135deg, ${a} 0 50%, ${b} 50% 100%)` }} />
  );
}

export function ProductExperience({
  product,
  categoryLabel,
  collectionLabel,
  next,
}: {
  product: Product;
  categoryLabel: string;
  collectionLabel: string;
  next: Product;
}) {
  const router = useRouter();
  const { add } = useCart();
  const { open } = useUI();
  const [finishId, setFinishId] = useState(product.finishes[0].id);
  const [sizeId, setSizeId] = useState(product.sizes[Math.min(1, product.sizes.length - 1)].id);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<ViewId>("studio");
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");
  const [sizeOpen, setSizeOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const finish = product.finishes.find((f) => f.id === finishId)!;
  const size = product.sizes.find((s) => s.id === sizeId)!;
  const multiSize = product.sizes.length > 1;

  // Sticky purchase bar on small screens once the main CTA scrolls away.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!sizeOpen) return;
    const onDown = (e: MouseEvent) => !sizeRef.current?.contains(e.target as Node) && setSizeOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSizeOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [sizeOpen]);

  const addToCart = () => {
    if (state !== "idle") return;
    setState("adding");
    add(product.slug, finishId, sizeId, qty);
    window.setTimeout(() => setState("added"), 420);
    window.setTimeout(() => open("cart"), 700);
    window.setTimeout(() => setState("idle"), 2200);
  };
  const buyNow = () => {
    add(product.slug, finishId, sizeId, qty);
    router.push("/checkout");
  };

  const ctaLabel = state === "adding" ? "Adding…" : state === "added" ? "Added to cart" : "Add to cart";

  return (
    <section id="overview" className="relative scroll-mt-24">
      <div className="relative lg:h-[max(720px,100svh)]">
        {/* Vertical anchor rail — reference B */}
        <nav aria-label="On this page" className="absolute left-[calc(var(--gutter)*0.6)] top-[30%] z-10 hidden flex-col gap-14 lg:flex">
          {[
            ["Overview", "#overview"],
            ["Details", "#details"],
            ["Related", "#related"],
          ].map(([l, h]) => (
            <a key={h} href={h} className="t-small border-b border-line-strong pb-0.5 text-fg-2 transition-colors hover:text-fg" style={{ writingMode: "vertical-rl" }}>
              {l}
            </a>
          ))}
        </nav>

        {/* Gallery */}
        <div className="relative h-[clamp(380px,62svh,640px)] bg-bg lg:absolute lg:left-[7%] lg:top-0 lg:h-[calc(100%-clamp(0px,2vw,40px))] lg:w-[44%]">
          <ProductGallery product={product} finish={finish} view={view} setView={setView} />
        </div>

        {/* Peeking next fixture — reference B right edge */}
        <Link
          href={`/product/${next.slug}`}
          className="group absolute right-0 top-0 hidden h-[46%] w-[10%] overflow-hidden xl:block"
          aria-label={`Next: ${next.name}`}
        >
          <div className="absolute left-[18%] top-0 h-full w-[150%] transition-transform duration-700 ease-[var(--ease-soft)] group-hover:-translate-x-[8%]">
            <LampArt art={next.art} finish={next.finishes[1] ?? next.finishes[0]} cableTop={-2000} className="absolute inset-0 h-full w-full" />
          </div>
          <span className="t-caption absolute bottom-2 left-[18%] text-fg-3 opacity-0 transition-opacity group-hover:opacity-100">Next →</span>
        </Link>

        {/* Info */}
        <div className="wrap relative pt-10 lg:absolute lg:left-[55%] lg:right-[12%] lg:top-[calc(var(--header-h)+9vh)] lg:w-auto lg:max-w-none lg:p-0">
          <motion.p {...reveal(0.1)} className="t-small text-fg-2">
            {categoryLabel} · {collectionLabel}
          </motion.p>
          <motion.h1 {...reveal(0.16)} className="t-hero mt-3">
            {product.name}
          </motion.h1>
          <motion.div {...reveal(0.26)} className="mt-6 max-w-[34em] space-y-3 md:mt-8">
            <p className="t-body t-small">{product.description}</p>
            <p className="t-small text-fg-3">{product.tagline}</p>
          </motion.div>

          <motion.p {...reveal(0.34, 0, 0.45)} className="t-num mt-7 flex items-baseline gap-3 text-[clamp(1.4rem,1.7vw,2.4rem)] font-light tracking-[-0.02em]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={size.price} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                {money(size.price * qty)}
              </motion.span>
            </AnimatePresence>
            {size.dims && <span className="t-small text-fg-3">{size.dims}</span>}
          </motion.p>

          {/* Finish */}
          <motion.fieldset {...reveal(0.4)} className="mt-6">
            <legend className="t-small text-fg-3">
              Finish — <span className="text-fg">{finish.name}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.finishes.map((f) => (
                <label key={f.id} className="cursor-pointer" title={f.name}>
                  <input type="radio" name="finish" value={f.id} checked={f.id === finishId} onChange={() => setFinishId(f.id)} className="peer sr-only" />
                  <span className="block h-9 w-9 rounded-full p-[3px] ring-1 ring-line transition-[box-shadow] duration-200 peer-checked:ring-fg peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fg">
                    <Swatch f={f} />
                  </span>
                  <span className="sr-only">{f.name}</span>
                </label>
              ))}
            </div>
          </motion.fieldset>

          {/* CTA — black block + grey size block */}
          <motion.div {...reveal(0.48)} ref={ctaRef} className="mt-8 flex max-w-[560px] items-stretch">
            <button
              type="button"
              onClick={addToCart}
              className="relative flex h-[clamp(56px,4.2vw,80px)] flex-[1.7] items-center justify-center gap-2 bg-inv text-[clamp(14px,0.25vw+13px,17px)] text-inv-fg transition-colors hover:bg-[color-mix(in_srgb,var(--inv)_84%,var(--bg))]"
              aria-live="polite"
            >
              {state === "added" && <IconCheck size={18} />}
              {ctaLabel}
            </button>
            {multiSize ? (
              <div ref={sizeRef} className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setSizeOpen((o) => !o)}
                  className="flex h-full w-full items-center justify-center gap-2 bg-surface text-[clamp(14px,0.25vw+13px,17px)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface)_85%,var(--fg))]"
                  aria-haspopup="listbox"
                  aria-expanded={sizeOpen}
                  aria-label={`Size: ${size.label}`}
                >
                  Size {size.label}
                  <span className="inline-block text-[10px] transition-transform duration-200" style={{ transform: sizeOpen ? "rotate(180deg)" : "none" }} aria-hidden>
                    ▲
                  </span>
                </button>
                <AnimatePresence>
                  {sizeOpen && (
                    <motion.ul
                      role="listbox"
                      aria-label="Size"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
                      className="absolute bottom-full right-0 z-20 mb-1 w-[min(300px,80vw)] bg-panel py-2 shadow-[0_24px_60px_-28px_rgba(0,0,0,.45)]"
                    >
                      {product.sizes.map((s) => (
                        <li key={s.id} role="option" aria-selected={s.id === sizeId}>
                          <button
                            type="button"
                            onClick={() => {
                              setSizeId(s.id);
                              setSizeOpen(false);
                            }}
                            className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors hover:bg-surface"
                          >
                            <span>
                              <span className="block">{s.label}</span>
                              <span className="t-small text-fg-3">{s.dims}</span>
                            </span>
                            <span className="t-num t-small flex items-center gap-2">
                              {money(s.price)}
                              {s.id === sizeId && <IconCheck size={14} />}
                            </span>
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center bg-surface">
                <span className="t-small text-fg-2">One size</span>
              </div>
            )}
          </motion.div>

          <motion.div {...reveal(0.54)} className="mt-3 flex max-w-[560px] flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={setQty} label="Quantity" />
            <button type="button" onClick={buyNow} className="btn btn-outline h-12 flex-1">
              Buy now
            </button>
          </motion.div>
          <motion.p {...reveal(0.6)} className="t-small mt-4 text-fg-3">
            {product.leadTime} · Complimentary delivery over $500 · 30-day returns
          </motion.p>
        </div>
      </div>

      {/* Mobile sticky purchase bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-line bg-bg px-5 py-3 lg:hidden"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{product.name}</p>
              <p className="t-num t-small text-fg-3">
                {money(size.price * qty)} · {finish.name}
              </p>
            </div>
            <button type="button" onClick={addToCart} className="btn btn-solid">
              {ctaLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
