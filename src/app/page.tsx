import Link from "next/link";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { AfterDarkBand } from "@/components/home/AfterDarkBand";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { HeroLightingScene } from "@/components/home/HeroLightingScene";
import { JournalCard } from "@/components/journal/JournalCard";
import { ProductCard } from "@/components/product/ProductCard";
import { IconArrowLong } from "@/components/ui/Icons";
import { collectionBySlug } from "@/lib/collections";
import { JOURNAL } from "@/lib/journal";
import { hasTag, productBySlug } from "@/lib/products";

const pick = (s: string) => productBySlug(s)!;

export default function Home() {
  const featured = [
    ...hasTag("featured").filter((p) => p.category === "pendant" || p.category === "ceiling"),
    productBySlug("arc-shade")!,
  ];
  return (
    <>
      <HeroLightingScene />

      <FeaturedCarousel products={featured} />

      {/* Editorial grid — reference A */}
      <section className="wrap pb-[var(--section)]" aria-labelledby="selected">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-12" data-reveal>
          <div>
            <p className="t-caption text-fg-3">The catalogue</p>
            <h2 id="selected" className="t-h2 mt-3">
              Selected pieces
            </h2>
          </div>
          <Link href="/shop" className="u-link t-caption inline-flex shrink-0 items-center gap-3">
            View all <IconArrowLong size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-[var(--gap)] lg:grid-cols-4" data-reveal-stagger>
          <div data-reveal className="flex">
            <ProductCard product={pick("frame-lantern")} className="w-full" />
          </div>
          <div data-reveal className="order-first col-span-2 flex lg:order-none">
            <ProductCard product={pick("cage-globe")} variant="wide" className="min-h-[300px] w-full md:min-h-[360px]" />
          </div>
          <div data-reveal className="flex">
            <ProductCard product={pick("vessel-pendant")} className="w-full" />
          </div>
          {["globe-filament", "knot-pendant", "cloche-pendant", "edison-st64"].map((s) => (
            <div key={s} data-reveal className="flex">
              <ProductCard product={pick(s)} variant="compact" className="w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Collections — reference A */}
      <section className="wrap pb-[var(--section)]" aria-labelledby="collections-title">
        <div className="grid grid-cols-1 gap-[var(--gap)] lg:grid-cols-4" data-reveal-stagger>
          <div data-reveal className="flex bg-bg-2 p-[clamp(10px,0.8vw,16px)]">
            <div className="flex w-full flex-col justify-between gap-10 bg-panel p-[clamp(20px,2vw,40px)] lg:aspect-[4/5.2]">
              <p className="t-caption t-num text-fg-3">2025 — 2026</p>
              <div>
                <h2 id="collections-title" className="t-display text-[clamp(2rem,2.6vw,3.8rem)]">
                  Selected
                  <br />
                  collections
                </h2>
                <p className="t-small mt-4 max-w-[22em] text-fg-2">
                  Four design lines, each built around a material and the light it makes. Start with one; they are designed to live
                  together.
                </p>
                <Link href="/collections" className="u-link t-caption mt-6 inline-flex items-center gap-3">
                  All collections <IconArrowLong size={16} />
                </Link>
              </div>
            </div>
          </div>
          <div
            data-reveal
            className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-[var(--gap)] overflow-x-auto px-[var(--gutter)] lg:col-span-3 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
          >
            {[
              ["nocturne", "frame-lantern"],
              ["meridian", "halo-ring"],
              ["terra", "ora-pendant"],
            ].map(([slug, lead]) => (
              <CollectionCard
                key={slug}
                collection={collectionBySlug(slug)!}
                lead={lead}
                className="aspect-[4/5.2] w-[72vw] shrink-0 snap-start sm:w-[44vw] lg:w-full"
              />
            ))}
          </div>
        </div>
      </section>

      <AfterDarkBand />

      {/* Story */}
      <section className="wrap section border-t border-line" aria-labelledby="story">
        <div className="grid gap-12 lg:grid-cols-12">
          <p className="t-caption text-fg-3 lg:col-span-3" data-reveal>
            The studio
          </p>
          <div className="lg:col-span-9">
            <h2 id="story" className="t-h1 max-w-[16em]" data-reveal>
              We make fewer fixtures, and make them to outlast the rooms they hang in.
            </h2>
            <dl className="mt-14 grid grid-cols-1 gap-10 border-t border-line pt-10 sm:grid-cols-3" data-reveal-stagger>
              {[
                ["4,000", "strikes of the hammer to raise one Vessel shade"],
                ["12", "family workshops across Portugal, Bohemia and the Jura"],
                ["2200 K", "our standard source — the colour of late evening"],
              ].map(([n, t]) => (
                <div key={n} data-reveal>
                  <dt className="t-h2 t-num">{n}</dt>
                  <dd className="t-body mt-2 max-w-[18em]">{t}</dd>
                </div>
              ))}
            </dl>
            <Link href="/about" className="btn btn-outline mt-14" data-reveal>
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* Journal */}
      <section className="wrap pb-[var(--section)]" aria-labelledby="journal-title">
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-12" data-reveal>
          <div>
            <p className="t-caption text-fg-3">Journal</p>
            <h2 id="journal-title" className="t-h2 mt-3">
              Notes on light
            </h2>
          </div>
          <Link href="/journal" className="u-link t-caption inline-flex shrink-0 items-center gap-3">
            All stories <IconArrowLong size={16} />
          </Link>
        </div>
        <div className="grid gap-x-[var(--gap)] gap-y-14 md:grid-cols-3" data-reveal-stagger>
          {JOURNAL.slice(0, 3).map((j) => (
            <div key={j.slug} data-reveal>
              <JournalCard entry={j} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
