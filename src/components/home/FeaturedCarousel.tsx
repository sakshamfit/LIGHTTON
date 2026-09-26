"use client";

import { motion, type PanInfo } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAddToCart } from "@/components/cart/useAddToCart";
import { ProductThumb } from "@/components/product/ProductThumb";
import { IconArrowLeft, IconArrowRight } from "@/components/ui/Icons";
import { money } from "@/lib/format";
import { categoryBySlug, minPrice } from "@/lib/products";
import type { Product } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Featured slider from reference A: a single hero fixture over a pale disc,
 * neighbours ghosted at either side.
 */
export function FeaturedCarousel({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const n = products.length;
  const add = useAddToCart();
  const go = useCallback((d: number) => setIndex((i) => (i + d + n) % n), [n]);
  const current = products[index];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) go(1);
    else if (info.offset.x > 50) go(-1);
  };

  useEffect(() => {
    const el = document.getElementById("featured-stage");
    const onKey = (e: KeyboardEvent) => {
      if (!el?.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <section className="wrap section pt-[calc(var(--section)*0.7)]" aria-roledescription="carousel" aria-label="Featured fixtures">
      <div className="mb-8 flex items-end justify-between gap-6 md:mb-12" data-reveal>
        <div>
          <p className="t-caption text-fg-3">Featured</p>
          <h2 className="t-h2 mt-3">Pieces we would hang first.</h2>
        </div>
        <p className="t-caption t-num hidden text-fg-3 sm:block" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </p>
      </div>

      <div id="featured-stage" className="relative overflow-hidden bg-bg-2" data-reveal="scale">
        <motion.div
          className="relative h-[clamp(440px,62vw,1060px)] touch-pan-y md:h-[clamp(480px,44vw,1180px)]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
        >
          {/* disc */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[50%] aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-panel md:w-[31%]"
            style={{ opacity: "calc(1 - var(--env) * 0.55)" }}
          />
          {products.map((p, i) => {
            let off = i - index;
            if (off > n / 2) off -= n;
            if (off < -n / 2) off += n;
            const abs = Math.abs(off);
            return (
              <motion.div
                key={p.slug}
                className="absolute left-1/2 top-0 h-[84%] w-[84%] md:h-[92%] md:w-[42%]"
                initial={false}
                animate={{
                  x: `${-50 + off * 96}%`,
                  scale: off === 0 ? 1 : 0.58,
                  opacity: abs === 0 ? 1 : abs === 1 ? 0.3 : 0,
                }}
                transition={{ duration: 0.8, ease: EASE }}
                style={{ transformOrigin: "50% 0%", zIndex: 5 - abs, pointerEvents: off === 0 ? "auto" : "none" }}
                aria-hidden={off !== 0}
              >
                <ProductThumb product={p} tone="none" className="h-full w-full" pad="tight" />
              </motion.div>
            );
          })}

          <div className="absolute inset-x-0 top-[50%] z-10 flex -translate-y-1/2 justify-between px-4 md:px-[25%]">
            <button type="button" onClick={() => go(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg-2/60 backdrop-blur-sm transition-colors hover:border-line-strong" aria-label="Previous fixture">
              <IconArrowLeft size={18} />
            </button>
            <button type="button" onClick={() => go(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg-2/60 backdrop-blur-sm transition-colors hover:border-line-strong" aria-label="Next fixture">
              <IconArrowRight size={18} />
            </button>
          </div>

          <motion.div
            key={current.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
            className="absolute bottom-6 left-5 right-5 z-10 flex items-end justify-between gap-4 md:bottom-[9%] md:left-auto md:right-[14%] md:block"
            aria-live="polite"
          >
            <div>
              <p className="t-small text-fg-3">{categoryBySlug(current.category)?.plural}</p>
              <Link href={`/product/${current.slug}`} className="t-h3 u-link mt-0.5 inline-block">
                {current.name}
              </Link>
              <p className="t-num mt-1 text-[1.15em] font-medium">
                {current.sizes.length > 1 ? "From " : ""}
                {money(minPrice(current))}
              </p>
            </div>
            <button type="button" onClick={() => add(current)} className="btn btn-outline btn-sm mt-4 shrink-0" aria-label={`Add ${current.name} to cart`}>
              Add to cart
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Choose fixture">
        {products.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={p.name}
            onClick={() => setIndex(i)}
            className="group flex h-8 items-center px-1"
          >
            <span className="block h-px transition-[width,background-color] duration-500" style={{ width: i === index ? 36 : 14, background: i === index ? "var(--fg)" : "var(--line-strong)", opacity: i === index ? 1 : 0.35 }} />
          </button>
        ))}
      </div>
    </section>
  );
}
