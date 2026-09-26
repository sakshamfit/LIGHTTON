"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

/** Animated grid: filter/sort changes reflow smoothly instead of jumping. */
export function ProductGrid({ products, morph = true, columns = "default" }: { products: Product[]; morph?: boolean; columns?: "default" | "three" }) {
  const cols =
    columns === "three"
      ? "grid-cols-2 lg:grid-cols-3"
      : "grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";
  return (
    <motion.ul layout className={`grid gap-[var(--gap)] ${cols}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {products.map((p, i) => (
          <motion.li
            key={p.slug}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 7) * 0.07 } }}
            exit={{ opacity: 0, scale: 0.985, transition: { duration: 0.22 } }}
            transition={{ layout: { duration: 0.42, ease: [0.22, 0.61, 0.36, 1] } }}
            className="flex"
          >
            <ProductCard product={p} morph={morph} className="w-full" />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
