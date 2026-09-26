"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { money } from "@/lib/format";
import { hasTag } from "@/lib/products";
import { FREE_SHIPPING_FROM } from "@/lib/shipping";
import { CartItem } from "./CartItem";
import { useCart } from "./CartProvider";

export function CartView() {
  const { lines, subtotal, count, ready } = useCart();
  if (!ready) return <div className="wrap min-h-[40vh]" aria-busy="true" />;

  if (!lines.length) {
    return (
      <div className="wrap pb-[var(--section)]">
        <div className="flex flex-col items-start gap-5 border-t border-line pt-12">
          <p className="t-h3">Your cart is empty.</p>
          <p className="t-body max-w-[30em]">Every room starts with a single source of light. Here are a few we would begin with.</p>
          <Link href="/shop" className="btn btn-solid">
            Browse the collection
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-[var(--gap)] lg:grid-cols-4">
          {hasTag("bestseller")
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
        </div>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : 25;
  return (
    <div className="wrap grid gap-12 pb-[var(--section)] lg:grid-cols-12">
      <ul className="border-t border-line lg:col-span-8" aria-label="Cart items">
        <AnimatePresence initial={false}>
          {lines.map((l) => (
            <motion.li
              key={l.key}
              layout
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="border-b border-line py-7">
                <CartItem line={l} large />
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        <li className="pt-6">
          <Link href="/shop" className="u-link t-caption">
            ← Continue shopping
          </Link>
        </li>
      </ul>
      <aside className="lg:col-span-4" aria-label="Order summary">
        <div className="bg-surface p-7 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:p-9">
          <h2 className="t-caption">Summary</h2>
          <dl className="mt-6 space-y-3 text-[0.95em]">
            <div className="flex justify-between">
              <dt className="text-fg-2">Subtotal ({count})</dt>
              <dd className="t-num">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fg-2">Standard delivery</dt>
              <dd className="t-num">{shipping ? money(shipping) : "Complimentary"}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-4 text-[1.15em]">
              <dt>Estimated total</dt>
              <dd className="t-num">{money(subtotal + shipping)}</dd>
            </div>
          </dl>
          <p className="t-small mt-2 text-fg-3">Taxes calculated at checkout.</p>
          <Link href="/checkout" className="btn btn-solid mt-7 w-full">
            Checkout
          </Link>
          <p className="t-small mt-5 text-fg-3">30-day returns · Two-year guarantee · Secure checkout</p>
        </div>
      </aside>
    </div>
  );
}
