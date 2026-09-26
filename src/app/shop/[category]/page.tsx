import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Catalogue } from "@/components/product/Catalogue";
import { ProductGrid } from "@/components/product/ProductGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { CATEGORIES, categoryBySlug, productsInCategory } from "@/lib/products";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  const c = categoryBySlug(category);
  return c ? { title: c.plural, description: c.blurb } : {};
}

export default async function CategoryPage(props: PageProps<"/shop/[category]">) {
  const { category } = await props.params;
  const c = categoryBySlug(category);
  if (!c) notFound();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: c.name }]}
        title={c.plural}
        intro={c.blurb}
      />
      <section className="wrap pb-[var(--section)]">
        <Suspense fallback={<ProductGrid products={productsInCategory(c.slug)} morph={false} />}>
          <Catalogue category={c.slug} />
        </Suspense>
      </section>
    </>
  );
}
