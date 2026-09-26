import type { Metadata } from "next";
import { JournalCard } from "@/components/journal/JournalCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { JOURNAL } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Stories on light, material and the hour after sunset.",
};

export default function JournalPage() {
  const [lead, ...rest] = JOURNAL;
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Journal" }]}
        title="Journal"
        intro="Stories on light, material and the hour after sunset."
      />
      <div className="wrap pb-[var(--section)]">
        <div data-reveal>
          <JournalCard entry={lead} large />
        </div>
        <div className="mt-[calc(var(--section)*0.7)] grid gap-x-[var(--gap)] gap-y-16 border-t border-line pt-14 md:grid-cols-3" data-reveal-stagger>
          {rest.map((j) => (
            <div key={j.slug} data-reveal>
              <JournalCard entry={j} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
