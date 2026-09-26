import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionScene } from "@/components/collections/CollectionScene";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductThumb } from "@/components/product/ProductThumb";
import { COLLECTIONS, collectionBySlug, collectionProducts } from "@/lib/collections";
import { money } from "@/lib/format";
import { categoryBySlug, minPrice, productBySlug } from "@/lib/products";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = collectionBySlug(slug);
  return c ? { title: `${c.name} collection`, description: c.intro } : {};
}

export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const c = collectionBySlug(slug);
  if (!c) notFound();
  const products = collectionProducts(c);
  const featured = c.featured.map((s) => productBySlug(s)!);
  const rest = products.filter((p) => !c.featured.includes(p.slug));
  const others = COLLECTIONS.filter((x) => x.slug !== c.slug && !x.products).slice(0, 3);

  return (
    <>
      {/* Large visual */}
      <section className="relative">
        <CollectionScene collection={c} className="h-[max(560px,88svh)]" />
        <div className="wrap pointer-events-none absolute inset-x-0 bottom-0 pb-[clamp(28px,4vw,72px)]">
          <nav
            aria-label="Breadcrumb"
            className="t-caption pointer-events-auto flex gap-2"
            style={{ color: c.tone === "deep" ? "#a8a094" : "var(--fg-3)" }}
          >
            <Link href="/collections" className="u-link">
              Collections
            </Link>
            <span aria-hidden>/</span>
            <span aria-current="page">{c.name}</span>
          </nav>
        </div>
      </section>

      {/* Title + story */}
      <section className="wrap grid gap-10 py-[calc(var(--section)*0.7)] lg:grid-cols-12">
        <div className="lg:col-span-6" data-reveal>
          <p className="t-caption t-num text-fg-3">
            {c.label} · {c.year}
          </p>
          <h1 className="t-display mt-4 text-[clamp(4rem,11vw,15rem)]">{c.name}</h1>
          <p className="t-lead mt-6 text-fg-2">{c.intro}</p>
        </div>
        <div className="space-y-5 lg:col-span-5 lg:col-start-8 lg:pt-12" data-reveal>
          {c.story.map((s, i) => (
            <p key={i} className={i === 0 ? "t-lead" : "t-body"}>
              {s}
            </p>
          ))}
          <p className="t-small pt-4 text-fg-3">{products.length} pieces in this collection</p>
        </div>
      </section>

      {/* Featured */}
      <section className="wrap grid gap-[var(--gap)] pb-[calc(var(--section)*0.7)] md:grid-cols-2" data-reveal-stagger>
        {featured.map((p) => (
          <Link key={p.slug} href={`/product/${p.slug}`} className="group block" data-reveal>
            <div className="overflow-hidden">
              <ProductThumb
                product={p}
                tone="bg-2"
                pad="loose"
                className="aspect-[4/4.6] transition-transform duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-[1.02]"
              />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <div>
                <p className="t-small text-fg-3">{categoryBySlug(p.category)?.name}</p>
                <h2 className="t-h2 mt-1">{p.name}</h2>
                <p className="t-body mt-2 max-w-[30em]">{p.tagline}</p>
              </div>
              <p className="t-num shrink-0 text-[1.15em]">
                {p.sizes.length > 1 ? "From " : ""}
                {money(minPrice(p))}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {rest.length > 0 && (
        <section className="wrap pb-[var(--section)]">
          <h2 className="t-caption mb-8 text-fg-3" data-reveal>
            The full collection
          </h2>
          <ProductGrid products={rest} morph={false} />
        </section>
      )}

      <section className="wrap border-t border-line py-[calc(var(--section)*0.7)]">
        <h2 className="t-caption mb-8 text-fg-3">Continue exploring</h2>
        <div className="grid gap-[var(--gap)] md:grid-cols-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/collections/${o.slug}`} className="group block">
              <CollectionScene collection={o} parallax={false} className="aspect-[4/3] transition-opacity group-hover:opacity-90" />
              <p className="t-display mt-4 text-[clamp(1.8rem,2.4vw,3.2rem)]">{o.name}</p>
              <p className="t-small text-fg-3">{o.label}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
