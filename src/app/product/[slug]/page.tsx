import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductExperience } from "@/components/product/ProductExperience";
import { ProductThumb } from "@/components/product/ProductThumb";
import { Accordion } from "@/components/ui/Accordion";
import { COLLECTIONS } from "@/lib/collections";
import { money } from "@/lib/format";
import { PRODUCTS, categoryBySlug, minPrice, nextProduct, productBySlug, relatedProducts } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = productBySlug(slug);
  if (!p) return {};
  return { title: `${p.name} — ${categoryBySlug(p.category)?.name}`, description: p.description };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = productBySlug(slug);
  if (!product) notFound();
  const cat = categoryBySlug(product.category)!;
  const col = COLLECTIONS.find((c) => c.slug === product.collection)!;
  const related = relatedProducts(product, 4);

  const spec = (rows: { label: string; value: string }[]) => (
    <dl className="grid max-w-[640px] grid-cols-[minmax(120px,1fr)_2fr] gap-x-6 gap-y-3">
      {rows.map((r) => (
        <div key={r.label} className="contents">
          <dt className="t-small text-fg-3">{r.label}</dt>
          <dd className="t-small">{r.value}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <>
      <ProductExperience product={product} categoryLabel={cat.name} collectionLabel={col.name} next={nextProduct(product)} />

      {/* Reference B lower band: two notes + small related cards */}
      <section className="wrap grid gap-10 border-b border-line pb-16 pt-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:pt-10" data-reveal-stagger>
        <div data-reveal className="lg:col-span-2 lg:col-start-2">
          <p className="text-[1.02em]">Material</p>
          <p className="t-small mt-2 text-fg-2">{product.materials[0]}. {product.materials[1]}.</p>
        </div>
        <div data-reveal className="lg:col-span-2">
          <p className="text-[1.02em]">Light</p>
          <p className="t-small mt-2 text-fg-2">
            {product.light.source}. {product.light.temperature}, {product.light.dimmable ? "dimmable" : "non-dimmable"}.
          </p>
        </div>
        {related.slice(0, 2).map((r) => (
          <Link key={r.slug} href={`/product/${r.slug}`} data-reveal className="group block lg:col-span-3">
            <ProductThumb product={r} className="aspect-[2/1] transition-colors" pad="tight" />
            <p className="t-num mt-3 text-[0.95em]">{money(minPrice(r))}</p>
            <p className="t-small mt-1 line-clamp-2 text-fg-3">{r.tagline}</p>
            <div className="mt-3 flex justify-end border-t border-line-strong pt-1.5">
              <span className="t-small text-[11px] transition-transform group-hover:-translate-x-1">More details</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Details */}
      <section id="details" className="wrap section grid scroll-mt-24 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4" data-reveal>
          <p className="t-caption text-fg-3">Details</p>
          <h2 className="t-h2 mt-3 max-w-[12em]">Made to be lived with.</h2>
          <p className="t-body mt-6 max-w-[28em]">{product.story}</p>
          <p className="t-small mt-6 text-fg-3">Designed by {product.designer}</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6" data-reveal>
          <Accordion
            items={[
              {
                title: "Materials & finish",
                body: (
                  <ul className="t-small space-y-2 text-fg-2">
                    {product.materials.map((m) => (
                      <li key={m}>— {m}</li>
                    ))}
                    <li className="pt-2 text-fg-3">Available in {product.finishes.map((f) => f.name).join(", ")}.</li>
                  </ul>
                ),
              },
              {
                title: "Dimensions",
                body: spec([
                  ...product.sizes.filter((s) => s.dims).map((s) => ({ label: `Size ${s.label}`, value: `${s.dims} — ${money(s.price)}` })),
                  ...product.details,
                ]),
              },
              {
                title: "Light & technical",
                body: spec([
                  { label: "Source", value: product.light.source },
                  { label: "Output", value: product.light.output },
                  { label: "Colour temperature", value: product.light.temperature },
                  { label: "Dimmable", value: product.light.dimmable ? "Yes — trailing-edge dimmers" : "No" },
                  { label: "Certification", value: "CE · UKCA · ETL listed" },
                ]),
              },
              {
                title: "Shipping & returns",
                body: (
                  <div className="t-small max-w-[36em] space-y-3 text-fg-2">
                    <p>{product.leadTime}. Every fixture is packed by hand in recycled, plastic-free packaging.</p>
                    <p>Complimentary standard delivery on orders over $500. Express and white-glove installation available at checkout.</p>
                    <p>Return any unused piece within 30 days. Made-to-order finishes are final sale.</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* Related */}
      <section id="related" className="wrap scroll-mt-24 pb-[var(--section)]">
        <div className="mb-8 flex items-end justify-between" data-reveal>
          <h2 className="t-h2">From the same family</h2>
          <Link href={`/collections/${col.slug}`} className="u-link t-caption shrink-0">
            {col.name} collection →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-[var(--gap)] lg:grid-cols-4" data-reveal-stagger>
          {related.map((r) => (
            <div key={r.slug} data-reveal className="flex">
              <ProductCard product={r} className="w-full" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
