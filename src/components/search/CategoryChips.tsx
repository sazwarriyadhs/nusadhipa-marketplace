"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/marketplace-api";
import { resolveCategorySlug, getCategoryVisual } from "@/lib/category-visual";

export function CategoryChips({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = resolveCategorySlug(searchParams.get("category"));
  const q = searchParams.get("q") ?? "";

  const buildHref = (slug: string | null) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (slug) params.set("category", slug);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <nav className="nd-category-chips" aria-label="Filter kategori">
      <Link
        href={buildHref(null)}
        className={`nd-chip ${!activeCategory ? "is-active" : ""}`}
      >
        Semua
      </Link>
      {categories.map((cat) => {
        const slug = resolveCategorySlug(cat.slug);
        const visual = getCategoryVisual(cat);
        const isActive = activeCategory === slug;
        return (
          <Link
            key={cat.id}
            href={buildHref(slug)}
            className={`nd-chip ${isActive ? "is-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {visual.label}
          </Link>
        );
      })}
    </nav>
  );
}
