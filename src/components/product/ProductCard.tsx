"use client";

import Link from "next/link";
import { ViewTransition } from "react";
import { useAddToCart } from "@/components/cart/useAddToCart";
import { COLLECTIONS } from "@/lib/collections";
import { money } from "@/lib/format";
import { categoryBySlug, minPrice } from "@/lib/products";
import type { Product } from "@/lib/types";
import { ProductThumb } from "./ProductThumb";

const BADGE: Record<string, string> = { bestseller: "Best seller", new: "New" };

export function ProductCard({
  product,
  variant = "grid",
  morph = false,
  tone = "surface",
  className = "",
}: {
  product: Product;
  variant?: "grid" | "wide" | "compact";
  morph?: boolean;
  tone?: "surface" | "bg-2";
  className?: string;
}) {
  const add = useAddToCart();
  const cat = categoryBySlug(product.category)!;
  const col = COLLECTIONS.find((c) => c.slug === product.collection)!;
  const badge = product.tags.find((t) => t in BADGE);
  const href = `/product/${product.slug}`;
  const from = product.sizes.length > 1 ? "From " : "";

  const image = (
    <div className="h-full w-full transition-transform duration-[280ms] ease-[var(--ease-out)] group-hover:scale-[1.025] group-focus-within:scale-[1.025]">
      <ProductThumb product={product} tone="none" className="h-full w-full" pad={variant === "wide" ? "tight" : "normal"} />
    </div>
  );
  const media = morph ? (
    <ViewTransition name={`product-${product.slug}`} share="morph" default="none">
      {image}
    </ViewTransition>
  ) : (
    image
  );

  const bg = tone === "surface" ? "bg-surface" : "bg-bg-2";

  if (variant === "wide") {
    return (
      <article className={`group relative grid grid-cols-[1fr_1.1fr] overflow-hidden ${bg} ${className}`}>
        <Link href={href} className="absolute inset-0 z-[1]" aria-label={`${product.name} — ${cat.name}`} />
        {badge && <Badge label={BADGE[badge]} />}
        <div className="relative flex flex-col justify-end p-[clamp(18px,1.8vw,36px)] pt-16">
          <Meta product={product} cat={cat.name} col={col.name} from={from} />
          <AddButton onClick={() => add(product)} name={product.name} />
        </div>
        <div className="relative overflow-hidden">{media}</div>
      </article>
    );
  }

  return (
    <article className={`group relative flex flex-col overflow-hidden ${bg} ${className}`}>
      <Link href={href} className="absolute inset-0 z-[1]" aria-label={`${product.name} — ${cat.name}`} />
      {badge && <Badge label={BADGE[badge]} />}
      <div className={`relative overflow-hidden ${variant === "compact" ? "aspect-[4/4.2]" : "aspect-[4/4.4]"}`}>{media}</div>
      <div className="relative flex flex-1 flex-col p-[clamp(16px,1.5vw,30px)] pt-2">
        <Meta product={product} cat={cat.name} col={col.name} from={from} />
        {variant !== "compact" && <AddButton onClick={() => add(product)} name={product.name} />}
      </div>
    </article>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="t-caption absolute left-0 top-[clamp(14px,1.4vw,26px)] z-[2] bg-inv px-3 py-1.5 text-[10px] text-inv-fg">{label}</span>
  );
}

function Meta({ product, cat, col, from }: { product: Product; cat: string; col: string; from: string }) {
  return (
    <div>
      <p className="t-small text-fg-3">
        {cat} · {col}
      </p>
      <h3 className="mt-0.5 text-[clamp(15px,0.35vw+13.8px,20px)] leading-snug text-fg-2 transition-colors duration-200 group-hover:text-fg">
        {product.name}
      </h3>
      <p className="t-num mt-1.5 text-[clamp(15px,0.4vw+13.5px,21px)] font-medium tracking-[-0.01em]">
        {from}
        {money(minPrice(product))}
      </p>
    </div>
  );
}

function AddButton({ onClick, name }: { onClick: () => void; name: string }) {
  return (
    <div className="relative z-[2] mt-4 flex items-center gap-4">
      <button type="button" onClick={onClick} className="btn btn-outline btn-sm" aria-label={`Add ${name} to cart`}>
        Add to cart
      </button>
    </div>
  );
}
