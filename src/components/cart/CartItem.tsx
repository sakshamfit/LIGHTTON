"use client";

import Link from "next/link";
import { ProductThumb } from "@/components/product/ProductThumb";
import { money } from "@/lib/format";
import { MAX_QTY, useCart, type ResolvedLine } from "./CartProvider";
import { QtyStepper } from "./QtyStepper";

export function CartItem({ line, onNavigate, large = false }: { line: ResolvedLine; onNavigate?: () => void; large?: boolean }) {
  const { setQty, remove } = useCart();
  const { product, finishDef, sizeDef } = line;
  return (
    <div className={`flex gap-4 ${large ? "sm:gap-8" : ""}`}>
      <Link
        href={`/product/${product.slug}`}
        onClick={onNavigate}
        className={`shrink-0 ${large ? "w-[28vw] max-w-[180px] sm:w-40" : "w-24"}`}
        tabIndex={-1}
        aria-hidden
      >
        <ProductThumb product={product} finish={finishDef} className="aspect-[4/5] w-full" pad="tight" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/product/${product.slug}`} onClick={onNavigate} className={`${large ? "t-h3" : ""} block truncate hover:underline`}>
              {product.name}
            </Link>
            <p className="t-small mt-1 text-fg-3">
              {finishDef.name}
              {product.sizes.length > 1 && <> · {sizeDef.label}</>}
            </p>
          </div>
          <p className="t-num shrink-0">{money(line.total)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <QtyStepper
            size="sm"
            value={line.qty}
            max={MAX_QTY}
            onChange={(n) => setQty(line.key, n)}
            label={`Quantity for ${product.name}`}
          />
          <button
            type="button"
            onClick={() => remove(line.key)}
            className="t-caption u-link text-fg-3 hover:text-fg"
            aria-label={`Remove ${product.name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
