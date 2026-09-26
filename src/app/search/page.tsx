import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/product/SearchResults";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]} title="Search" />
      <section className="wrap pb-[var(--section)]">
        <Suspense fallback={<div className="h-40" />}>
          <SearchResults />
        </Suspense>
      </section>
    </>
  );
}
