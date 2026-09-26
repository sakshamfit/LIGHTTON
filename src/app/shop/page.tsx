import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogue } from "@/components/product/Catalogue";
import { ProductGrid } from "@/components/product/ProductGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop all lighting",
  description: "Pendant, ceiling, table, floor, wall and outdoor lighting in brass, glass, oak and enamel.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        title="All lighting"
        intro="Twenty fixtures across seven kinds of light — each drawn for the day it hangs in and the night it creates."
      />
      <section className="wrap pb-[var(--section)]">
        <Suspense fallback={<ProductGrid products={PRODUCTS} morph={false} />}>
          <Catalogue />
        </Suspense>
      </section>
    </>
  );
}
