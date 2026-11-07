import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SearchBar } from "@/components/home/SearchBar";
import { CategoryChips } from "@/components/search/CategoryChips";
import { Pagination } from "@/components/search/Pagination";
import { SearchToolbar } from "@/components/search/SearchToolbar";
import { getSauriImage } from "@/lib/sauri-images";
import { formatStock } from "@/lib/format-stock";
import { CATEGORY_SLUG_MAP } from "@/lib/category-visual";
import {
  getCategories,
  getProducts,
  formatRupiah,
  type Category,
  type Product,
} from "@/lib/marketplace-api";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type PageProps = {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps) {
  const { q, category } = await searchParams;
  const parts: string[] = [];
  if (q) parts.push(`"${q}"`);
  if (category) parts.push(category.replace(/-/g, " "));
  return {
    title: parts.length
      ? `Cari ${parts.join(" · ")} — NUSA-DHIPA`
      : "Cari Produk — NUSA-DHIPA Marketplace",
    description:
      "Cari produk, layanan, atau mitra usaha di NUSA-DHIPA Marketplace.",
  };
}

const API_BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
  process.env.MARKETPLACE_API_URL ||
  "https://api.nusadhipa.shop/api/v1"
).replace(/\/api\/v1\/?$/, "");

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function ProductCard({ product }: { product: Product }) {
  const originalImageUrl = resolveImageUrl(product.image_url);
  const fallbackByProduct = getSauriImage(product.name);
  const imageUrl = originalImageUrl || fallbackByProduct;
  const href = `/produk/${encodeURIComponent(product.slug)}`;

  const price =
    product.min_price == null
      ? "Harga belum tersedia"
      : product.max_price != null && product.max_price !== product.min_price
        ? `${formatRupiah(product.min_price)} - ${formatRupiah(product.max_price)}`
        : formatRupiah(product.min_price);

  return (
    <article className="nd-product-card">
      <Link
        href={href}
        className="nd-product-card__link"
        aria-label={`Lihat produk ${product.name}`}
      >
        <div className="nd-product-card__media">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.name}
              className="nd-product-image"
              loading="lazy"
            />
          ) : (
            <div className="nd-store-product-card__empty">
              <span aria-hidden="true">{"\uD83D\uDECD\uFE0F"}</span>
              <small>Foto belum tersedia</small>
            </div>
          )}
          {product.category_name ? (
            <span className="nd-product-card__tag">
              {product.category_name}
            </span>
          ) : null}
        </div>
        <div className="nd-product-card__body">
          <h3>{product.name}</h3>
          <p className="nd-product-card__price">{price}</p>
          {product.business_name ? (
            <p className="nd-product-card__seller">
              <span aria-hidden="true">✓</span> {product.business_name}
            </p>
          ) : null}
          {product.available_stock != null ? (
            <p className="nd-product-card__stock">
              Stok:{" "}
              {formatStock(
                product.available_stock,
                product.selling_unit,
                product.sales_mode,
              )}
            </p>
          ) : null}
        </div>
      </Link>
      <Link href={href} className="nd-product-card__button">
        Lihat Produk <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, category, page } = await searchParams;
  const parsed = Number.parseInt(page ?? "1", 10);
  const currentPage =
    Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;

  // Terjemahkan kategori URL menjadi kategori API (Database)
  const apiCategory = category ? (CATEGORY_SLUG_MAP[category] || category) : undefined;

  const [categoriesResult, productsResult] = await Promise.all([
    getCategories().catch(() => [] as Category[]),
    getProducts({
      q: q?.trim() || undefined,
      category: apiCategory,
      page: currentPage,
      limit: PAGE_SIZE,
    }).catch(() => ({ data: [] as Product[], pagination: undefined })),
  ]);

  const categories = categoriesResult.filter((c) => c.parent_id === null);
  const products = productsResult?.data ?? [];
  const totalProducts =
    productsResult?.pagination?.total ?? products.length;
  const totalPages =
    productsResult?.pagination?.total_pages ??
    Math.ceil(totalProducts / PAGE_SIZE);

  if (totalPages > 0 && currentPage > totalPages) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    params.set("page", String(totalPages));
    redirect(`/search?${params.toString()}`);
  }

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  return (
    <main className="nd-marketplace">
      <div className="nd-content">
        <nav className="nd-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Search</span>
          {q ? (
            <>
              <span aria-hidden="true">/</span>
              <span aria-current="page">&quot;{q}&quot;</span>
            </>
          ) : null}
        </nav>

        <section className="nd-search-header">
          <h1>Cari produk, layanan, atau mitra usaha</h1>
          <p>
            Gunakan kata kunci atau filter kategori untuk menemukan produk
            yang kamu butuhkan.
          </p>
          <SearchBar
            defaultValue={q ?? ""}
            selectedCategory={category ?? ""}
          />
        </section>

        <Suspense fallback={<div className="nd-skeleton--chips" />}>
          <CategoryChips categories={categories} />
        </Suspense>

        <Suspense fallback={null}>
          <SearchToolbar totalProducts={totalProducts} />
        </Suspense>

        {products.length === 0 ? (
          <div className="nd-empty-state" role="status">
            <span aria-hidden="true">{"\uD83D\uDD0E"}</span>
            <h3>Tidak ada produk ditemukan</h3>
            <p>Coba kata kunci lain atau reset filter.</p>
            <Link href="/search" className="nd-btn nd-btn--primary">
              Reset pencarian
            </Link>
          </div>
        ) : (
          <>
            <div className="nd-product-grid">
              {products.slice(0, 25).map((p, i) => (
                <ProductCard
                  key={p.public_id ?? p.slug ?? `p-${i}`}
                  product={p}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              buildHref={buildHref}
            />
          </>
        )}
      </div>
    </main>
  );
}