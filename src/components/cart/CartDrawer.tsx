"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { useUI } from "@/components/layout/UIProvider";
import { LampArt } from "@/components/lamps/LampArt";
import { IconClose } from "@/components/ui/Icons";
import { useFocusTrap } from "@/components/ui/useFocusTrap";
import { money } from "@/lib/format";
import { PRODUCTS } from "@/lib/products";
import { FREE_SHIPPING_FROM } from "@/lib/shipping";
import { CartItem } from "./CartItem";
import { useCart } from "./CartProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CartDrawer() {
  const { panel, close } = useUI();
  return <AnimatePresence>{panel === "cart" && <Drawer onClose={close} />}</AnimatePresence>;
}

function Drawer({ onClose }: { onClose: () => void }) {
  const { lines, count, subtotal } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true);
  const toFree = Math.max(0, FREE_SHIPPING_FROM - subtotal);

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Cart">
      <motion.button
        type="button"
        tabIndex={-1}
        aria-label="Close cart"
        className="absolute inset-0 h-full w-full cursor-default"
        style={{ background: "rgba(10,10,12,.38)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.45 } }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        onClick={onClose}
      />
      <motion.aside
        ref={ref}
        className="absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col bg-bg shadow-[-30px_0_80px_-40px_rgba(0,0,0,.4)]"
        initial={{ x: "100%" }}
        animate={{ x: 0, transition: { duration: 0.56, ease: EASE } }}
        exit={{ x: "100%", transition: { duration: 0.46, ease: [0.65, 0, 0.35, 1] } }}
      >
        <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line px-6 sm:px-10">
          <h2 className="t-caption">
            Cart <span className="t-num text-fg-3">({count})</span>
          </h2>
          <button type="button" onClick={onClose} className="-mr-3 inline-flex h-11 w-11 items-center justify-center" aria-label="Close cart">
            <IconClose />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="relative mb-8 h-44 w-36">
              <LampArt art="teardrop" finish={PRODUCTS.find((p) => p.art === "teardrop")!.finishes[0]} cableTop={-300} className="absolute inset-0 h-full w-full" />
            </div>
            <p className="t-h3">Your cart is empty.</p>
            <p className="t-body mt-2 max-w-[22em]">Every room starts with a single source of light.</p>
            <Link href="/shop" onClick={onClose} className="btn btn-solid mt-8">
              Browse the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="shrink-0 px-6 pt-5 sm:px-10">
              <p className="t-small text-fg-2">
                {toFree > 0 ? (
                  <>
                    Add <span className="t-num text-fg">{money(toFree)}</span> for complimentary delivery.
                  </>
                ) : (
                  "Complimentary standard delivery is included."
                )}
              </p>
              <div className="mt-3 h-px w-full bg-line">
                <div
                  className="h-px bg-fg transition-[width] duration-500 ease-[var(--ease-soft)]"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)}%` }}
                />
              </div>
            </div>
            <ul className="flex-1 overflow-y-auto px-6 py-4 sm:px-10">
              <AnimatePresence initial={false}>
                {lines.map((l) => (
                  <motion.li
                    key={l.key}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-b border-line py-5">
                      <CartItem line={l} onNavigate={onClose} />
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="shrink-0 border-t border-line px-6 pb-6 pt-5 sm:px-10 sm:pb-8">
              <div className="flex items-baseline justify-between">
                <span>Subtotal</span>
                <span className="t-num text-[1.2em]">{money(subtotal)}</span>
              </div>
              <p className="t-small mt-1 text-fg-3">Shipping and taxes calculated at checkout.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link href="/cart" onClick={onClose} className="btn btn-outline">
                  View cart
                </Link>
                <Link href="/checkout" onClick={onClose} className="btn btn-solid">
                  Checkout
                </Link>
              </div>
              <button type="button" onClick={onClose} className="t-caption u-link mx-auto mt-4 block text-fg-3 hover:text-fg">
                Continue shopping
              </button>
            </div>
          </>
        )}
      </motion.aside>
    </div>
  );
}
