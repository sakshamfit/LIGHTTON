import Link from "next/link";
import { LampArt } from "@/components/lamps/LampArt";
import { PRODUCTS } from "@/lib/products";

export default function NotFound() {
  const p = PRODUCTS.find((x) => x.art === "teardrop")!;
  return (
    <section className="wrap relative grid min-h-[88svh] items-center gap-10 pt-[var(--header-h)] md:grid-cols-2">
      <div className="relative h-[52svh] md:h-[80svh]" aria-hidden>
        <LampArt art={p.art} finish={p.finishes[0]} cableTop={-2000} className="absolute inset-0 h-full w-full" />
      </div>
      <div>
        <p className="t-caption t-num text-fg-3">404</p>
        <h1 className="t-h1 mt-4">This fixture isn’t here.</h1>
        <p className="t-body mt-4 max-w-[26em]">The page you were looking for has been moved or switched off. The rest of the collection is still lit.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="btn btn-solid">
            Shop all lighting
          </Link>
          <Link href="/" className="btn btn-outline">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
