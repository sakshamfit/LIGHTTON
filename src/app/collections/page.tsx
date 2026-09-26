import type { Metadata } from "next";
import Link from "next/link";
import { CollectionScene } from "@/components/collections/CollectionScene";
import { IconArrowLong } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { COLLECTIONS, DESIGN_COLLECTIONS, collectionProducts } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Collections",
  description: "Nocturne, Clarion, Terra and Meridian — four design lines, each built around a material and the light it makes.",
};

export default function CollectionsPage() {
  const curated = COLLECTIONS.filter((c) => c.products);
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Collections" }]}
        title="Collections"
        intro="Four design lines, each built around a material and the light it makes. Designed to live together."
      />
      <div className="wrap space-y-[var(--section)] pb-[var(--section)]">
        {DESIGN_COLLECTIONS.map((c, i) => (
          <article key={c.slug} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <Link
              href={`/collections/${c.slug}`}
              className={`block lg:col-span-7 ${i % 2 ? "lg:order-2 lg:col-start-6" : ""}`}
              data-reveal="scale"
              tabIndex={-1}
              aria-hidden
            >
              <CollectionScene collection={c} className="aspect-[4/3] md:aspect-[16/11]" />
            </Link>
            <div className={`lg:col-span-4 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`} data-reveal>
              <p className="t-caption t-num text-fg-3">
                {c.label} · {c.year}
              </p>
              <h2 className="t-display mt-4 text-[clamp(3rem,6vw,8rem)]">{c.name}</h2>
              <p className="t-lead mt-5 text-fg-2">{c.intro}</p>
              <p className="t-body mt-4">{c.story[0]}</p>
              <p className="t-small mt-6 text-fg-3">{collectionProducts(c).length} pieces</p>
              <Link href={`/collections/${c.slug}`} className="btn btn-outline mt-8 gap-3">
                Explore collection <IconArrowLong size={16} />
              </Link>
            </div>
          </article>
        ))}

        <section className="grid gap-[var(--gap)] border-t border-line pt-[calc(var(--section)*0.6)] md:grid-cols-2" data-reveal-stagger>
          {curated.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} data-reveal className="group flex items-end justify-between gap-6 bg-surface p-[clamp(24px,3vw,56px)]">
              <div>
                <p className="t-caption text-fg-3">{c.label}</p>
                <p className="t-display mt-3 text-[clamp(2.2rem,3.4vw,4.6rem)]">{c.name}</p>
                <p className="t-body mt-3 max-w-[26em]">{c.intro}</p>
              </div>
              <IconArrowLong className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
