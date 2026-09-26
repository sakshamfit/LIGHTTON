"use client";

import { useCallback } from "react";
import { useUI } from "@/components/layout/UIProvider";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

/** Adds a product and confirms it — either by opening the drawer or with a quiet toast. */
export function useAddToCart() {
  const { add } = useCart();
  const { notify, open } = useUI();
  return useCallback(
    (p: Product, opts: { finish?: string; size?: string; qty?: number; reveal?: "drawer" | "toast" } = {}) => {
      const finish = opts.finish ?? p.finishes[0].id;
      const size = opts.size ?? p.sizes[0].id;
      add(p.slug, finish, size, opts.qty ?? 1);
      if (opts.reveal === "drawer") open("cart");
      else
        notify({
          title: `${p.name} added to cart`,
          body: p.finishes.find((f) => f.id === finish)?.name,
          action: { label: "View cart", onClick: () => open("cart") },
        });
    },
    [add, notify, open],
  );
}
