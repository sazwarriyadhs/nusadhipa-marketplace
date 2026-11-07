"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { resolveCategorySlug, CATEGORY_VISUALS } from "@/lib/category-visual";

export function SearchToolbar({ totalProducts }: { totalProducts: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = resolveCategorySlug(searchParams.get("category"));
  const hasFilter = Boolean(q || category);

  const hrefWithout = (drop: "q" | "category") => {
    const params = new URLSearchParams();
    if (q && drop !== "q") params.set("q", q);
    if (category && drop !== "category") params.set("category", category);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <div className="nd-search-toolbar">
      <p className="nd-search-toolbar__count">
        <strong>{totalProducts.toLocaleString("id-ID")}</strong> produk ditemukan
      </p>

      {hasFilter ? (
        <div className="nd-active-filters">
          {q ? (
            <Link
              href={hrefWithout("q")}
              className="nd-filter-badge"
              aria-label={`Hapus filter pencarian ${q}`}
            >
              &quot;{q}&quot; <span aria-hidden="true">×</span>
            </Link>
          ) : null}
          {category ? (
            <Link
              href={hrefWithout("category")}
              className="nd-filter-badge"
              aria-label={`Hapus filter kategori ${category}`}
            >
              {CATEGORY_VISUALS[category]?.label ?? category}{" "}
              <span aria-hidden="true">×</span>
            </Link>
          ) : null}
          <Link href={pathname} className="nd-filter-reset">
            Reset semua
          </Link>
        </div>
      ) : null}
    </div>
  );
}
