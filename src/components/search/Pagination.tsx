import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return range(1, total);
  if (current <= 4) return [...range(1, 5), "...", total];
  if (current >= total - 3) return [1, "...", ...range(total - 4, total)];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function Pagination({ currentPage, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null;
  const pages = getPageList(currentPage, totalPages);

  return (
    <nav className="nd-pagination" aria-label="Navigasi halaman">
      {currentPage > 1 ? (
        <Link href={buildHref(currentPage - 1)} className="nd-page-btn" aria-label="Halaman sebelumnya">‹</Link>
      ) : (
        <span className="nd-page-btn is-disabled" aria-hidden="true">‹</span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} className="nd-page-gap" aria-hidden="true">…</span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`nd-page-btn ${p === currentPage ? "is-current" : ""}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={buildHref(currentPage + 1)} className="nd-page-btn" aria-label="Halaman berikutnya">›</Link>
      ) : (
        <span className="nd-page-btn is-disabled" aria-hidden="true">›</span>
      )}
    </nav>
  );
}
