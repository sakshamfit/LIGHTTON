import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  crumbs = [],
  eyebrow,
  title,
  intro,
  aside,
}: {
  crumbs?: { label: string; href?: string }[];
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="wrap pb-10 pt-[calc(var(--header-h)+clamp(40px,6vw,120px))] md:pb-14">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="t-caption flex flex-wrap items-center gap-2 text-fg-3">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="u-link hover:text-fg">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-fg-2">
                    {c.label}
                  </span>
                )}
                {i < crumbs.length - 1 && <span aria-hidden>/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {eyebrow && <p className="t-caption mb-4 text-fg-3">{eyebrow}</p>}
          <h1 className="t-hero">
            {title}
          </h1>
        </div>
        {(intro || aside) && (
          <div className="lg:col-span-4">
            {intro && <p className="t-lead max-w-[26em] text-fg-2">{intro}</p>}
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
