import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JournalCard, JournalScene } from "@/components/journal/JournalCard";
import { ProductCard } from "@/components/product/ProductCard";
import { formatDate } from "@/lib/format";
import { JOURNAL, journalBySlug } from "@/lib/journal";
import { productBySlug } from "@/lib/products";

export function generateStaticParams() {
  return JOURNAL.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata(props: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const j = journalBySlug(slug);
  return j ? { title: j.title, description: j.excerpt } : {};
}

export default async function ArticlePage(props: PageProps<"/journal/[slug]">) {
  const { slug } = await props.params;
  const entry = journalBySlug(slug);
  if (!entry) notFound();
  const idx = JOURNAL.findIndex((j) => j.slug === slug);
  const next = JOURNAL[(idx + 1) % JOURNAL.length];

  return (
    <article>
      <header className="wrap pb-12 pt-[calc(var(--header-h)+clamp(40px,6vw,120px))]">
        <nav aria-label="Breadcrumb" className="t-caption mb-8 flex gap-2 text-fg-3">
          <Link href="/journal" className="u-link hover:text-fg">
            Journal
          </Link>
          <span aria-hidden>/</span>
          <span className="text-fg-2">{entry.kicker}</span>
        </nav>
        <h1 className="t-hero max-w-[14em]">{entry.title}</h1>
        <p className="t-small mt-8 flex flex-wrap gap-x-4 text-fg-3">
          <time dateTime={entry.date}>{formatDate(entry.date)}</time>
          <span>{entry.readTime} read</span>
        </p>
      </header>

      <JournalScene arts={entry.art} className="h-[max(420px,72svh)]" />

      <div className="wrap grid gap-10 py-[var(--section)] lg:grid-cols-12">
        <p className="t-lead text-fg-2 lg:col-span-3">{entry.excerpt}</p>
        <div className="space-y-6 lg:col-span-7 lg:col-start-5">
          {entry.body.map((b, i) =>
            b.type === "p" ? (
              <p key={i} className={i === 0 ? "t-lead" : "t-body text-[1.06em]"}>
                {b.text}
              </p>
            ) : b.type === "h" ? (
              <h2 key={i} className="t-h3 pt-6">
                {b.text}
              </h2>
            ) : (
              <figure key={i} className="border-l border-line-strong py-2 pl-6 md:my-12 md:pl-10">
                <blockquote className="t-h2">“{b.text}”</blockquote>
                {b.by && <figcaption className="t-caption mt-4 text-fg-3">— {b.by}</figcaption>}
              </figure>
            ),
          )}
        </div>
      </div>

      <section className="wrap border-t border-line py-[calc(var(--section)*0.7)]">
        <h2 className="t-caption mb-8 text-fg-3">In this story</h2>
        <div className="grid grid-cols-2 gap-[var(--gap)] lg:grid-cols-3" data-reveal-stagger>
          {entry.products.map((s) => (
            <div key={s} data-reveal className="flex">
              <ProductCard product={productBySlug(s)!} className="w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="wrap border-t border-line py-[calc(var(--section)*0.7)]">
        <p className="t-caption mb-8 text-fg-3">Next story</p>
        <div className="max-w-[900px]">
          <JournalCard entry={next} />
        </div>
      </section>
    </article>
  );
}
