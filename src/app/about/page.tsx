import type { Metadata } from "next";
import Link from "next/link";
import { JournalScene } from "@/components/journal/JournalCard";
import { BODY, TRIM } from "@/components/lamps/materials";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description: "Vesper is a small lighting studio designing fixtures for the day they hang in and the night they create.",
};

const PRINCIPLES = [
  {
    t: "Light before form",
    d: "We begin with the light a room needs — a pool on a table, a glow in a corridor — and only then draw the object that makes it.",
  },
  {
    t: "Honest materials",
    d: "Brass that tarnishes, oak that darkens, glass with the seeds of the furnace left in. Materials that age with the people who live with them.",
  },
  {
    t: "Made to outlast",
    d: "Every fixture is repairable, every part replaceable. We would rather make fewer pieces that stay for decades.",
  },
];

const MATERIALS = [
  { name: "Solid brass", note: "Machined, beaten and brushed by hand. Left unlacquered to develop a living patina.", ramp: BODY.brass },
  { name: "Oak & walnut", note: "Turned from FSC-certified European hardwood and finished with hardwax oil.", ramp: TRIM.oak },
  { name: "Mouth-blown glass", note: "Clear, opal and amber — blown into beechwood moulds in northern Bohemia.", ramp: ["#c9d4de", "#ffffff", "#eef3f7", "#d8e0e8", "#b9c5d1"] },
  { name: "Vitreous enamel", note: "Fired twice onto steel for a deep, even finish that resists fading.", ramp: BODY.black },
  { name: "Copper", note: "Polished interiors that warm the light before it leaves the shade.", ramp: BODY.copper },
  { name: "Belgian linen", note: "Woven with a natural slub that softens light as it passes through.", ramp: BODY.linen },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Home", href: "/" }, { label: "About" }]} eyebrow="About the studio" title="Light, drawn twice." />

      <section id="story" className="scroll-mt-24">
        <JournalScene arts={["cage", "vessel", "cloche"]} className="h-[max(460px,70svh)]" />
        <div className="wrap grid gap-10 py-[var(--section)] lg:grid-cols-12">
          <p className="t-caption text-fg-3 lg:col-span-3" data-reveal>
            Our story
          </p>
          <div className="lg:col-span-8" data-reveal>
            <p className="t-h2 max-w-[20em]">
              Vesper began in 2016 in a small Lisbon workshop, with a single question: why do lamps look so different at noon and at nine?
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <p className="t-body">
                Most lighting is designed for the showroom — bright, even, daytime. We design for both lives of a fixture: the object you see
                in daylight, and the atmosphere it creates after dark.
              </p>
              <p className="t-body">
                Today we work with twelve family workshops across Portugal, Bohemia and the Jura. Every piece is made to order or in small
                batches, and every one can be repaired.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="philosophy" className="wrap scroll-mt-24 border-t border-line py-[var(--section)]">
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="t-caption text-fg-3 lg:col-span-3" data-reveal>
            Design philosophy
          </p>
          <ol className="grid gap-12 md:grid-cols-3 lg:col-span-9" data-reveal-stagger>
            {PRINCIPLES.map((p, i) => (
              <li key={p.t} data-reveal>
                <span className="t-caption t-num text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="t-h3 mt-4">{p.t}</h2>
                <p className="t-body mt-3">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="materials" className="wrap scroll-mt-24 border-t border-line py-[var(--section)]">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3" data-reveal>
            <p className="t-caption text-fg-3">Materials</p>
            <p className="t-body mt-4 max-w-[20em]">Six materials, chosen for how they hold light — and how they age.</p>
          </div>
          <ul className="grid grid-cols-1 gap-[var(--gap)] sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3" data-reveal-stagger>
            {MATERIALS.map((m) => (
              <li key={m.name} data-reveal className="bg-surface">
                <div className="aspect-[5/3]" style={{ background: `linear-gradient(90deg, ${m.ramp.join(", ")})` }} aria-hidden />
                <div className="p-6">
                  <h3 className="text-[1.05em]">{m.name}</h3>
                  <p className="t-small mt-2 text-fg-2">{m.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap border-t border-line py-[var(--section)]">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end" data-reveal>
          <p className="t-h1 max-w-[14em]">Visit the showroom, or plan a project with us.</p>
          <div className="flex gap-3">
            <Link href="/contact" className="btn btn-solid">
              Contact the studio
            </Link>
            <Link href="/shop" className="btn btn-outline">
              Shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
