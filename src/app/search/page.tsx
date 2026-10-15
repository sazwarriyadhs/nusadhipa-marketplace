import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import { SearchBar } from "@/components/home/SearchBar";
import {
  formatRupiah,
  getCategories,
  getProducts,
  type Category,
  type Product,
} from "@/lib/marketplace-api";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
};

/* ---------- Helpers ---------- */

function extractApiList<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];
  if (!response || typeof response !== "object") return [];

  const result = response as Record<string, unknown>;

  for (const key of [
    "items",
    "data",
    "results",
    "products",
    "categories",
    "rows",
  ]) {
    const value = result[key];

    if (Array.isArray(value)) return value as T[];

    if (value && typeof value === "object") {
      const nested = extractApiList<T>(value);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

const categoryVisuals: Record<string, { icon: string; label: string }> = {
  "makanan-minuman": { icon: "🍱", label: "Makanan & Minuman" },
  "pertanian-peternakan": { icon: "🌾", label: "Pertanian & Peternakan" },
  "hewan-peliharaan": { icon: "🐾", label: "Hewan Peliharaan" },
  "fashion-aksesori": { icon: "👕", label: "Fashion & Aksesori" },
  "rumah-perlengkapan": { icon: "🏠", label: "Rumah & Perlengkapan" },
  "kesehatan-kecantikan": { icon: "✨", label: "Kesehatan & Kecantikan" },
  "elektronik-digital": { icon: "💻", label: "Elektronik & Digital" },
  "jasa-layanan": { icon: "🛠️", label: "Jasa & Layanan" },
  ayam: { icon: "🐓", label: "Ayam" },
  unggas: { icon: "🐓", label: "Ayam & Unggas" },
  ikan: { icon: "🐟", label: "Ikan" },
  petfood: { icon: "🐾", label: "Petfood" },
  "pakan-hewan": { icon: "🐾", label: "Petfood" },
  daging: { icon: "🥩", label: "Daging" },
  frozen: { icon: "❄️", label: "Frozen Food" },
  "frozen-food": { icon: "❄️", label: "Frozen Food" },
  bumbu: { icon: "🌿", label: "Bumbu" },
};

function getCategoryVisual(category: Category) {
  const key = `${category.slug ?? ""} ${category.name ?? ""}`.toLowerCase();
  const match = Object.entries(categoryVisuals).find(([needle]) =>
    key.includes(needle),
  );

  return (
    match?.[1] ?? {
      icon: "🛍️",
      label: category.name || "Lainnya",
    }
  );
}

/* ---------- Components ---------- */

function ProductImage({ product }: { product: Product }) {
  if (product.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={resolveImageUrl(product.image_url) || ""}
        alt={product.name}
        className="nd-product-image"
        loading="lazy"
      />
    );
  }

  return (
    <div
      className="nd-product-image nd-product-image--empty"
      role="img"
      aria-label={`Gambar ${product.name} belum tersedia`}
    >
      <span aria-hidden="true">🛍️</span>
      <small>Foto belum tersedia</small>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const href = `/produk/${encodeURIComponent(product.slug)}`;

  const price =
    product.min_price == null
      ? "Harga belum tersedia"
      : product.max_price != null &&
          product.max_price !== product.min_price
        ? `${formatRupiah(product.min_price)} – ${formatRupiah(product.max_price)}`
        : formatRupiah(product.min_price);

  const hasStock =
    product.available_stock != null && product.available_stock > 0;

  return (
    <article className="nd-product-card">
      <Link
        href={href}
        className="nd-product-card__link"
        aria-label={`Lihat produk ${product.name}`}
      >
        <div className="nd-product-card__media">
          <ProductImage product={product} />

          {product.category_name ? (
            <span className="nd-product-card__tag">
              {product.category_name}
            </span>
          ) : null}

          {hasStock ? (
            <span className="nd-badge nd-badge--stock">
              Stok {product.available_stock}
            </span>
          ) : null}
        </div>

        <div className="nd-product-card__body">
          <h3>{product.name}</h3>

          <p
            className={`nd-product-card__price${
              product.min_price == null ? " is-unset" : ""
            }`}
          >
            {price}
          </p>

          {product.business_name ? (
            <p className="nd-product-card__seller">
              <span aria-hidden="true">✓</span> {product.business_name}
            </p>
          ) : null}

          {product.available_stock != null ? (
            <p className="nd-product-card__stock">
              Stok tersedia: {product.available_stock}
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

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="nd-empty-state" role="status">
      <span aria-hidden="true">🔎</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

/* ---------- Search page ---------- */

const PAGE_SIZE = 12;

const API_BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
  process.env.MARKETPLACE_API_URL ||
  "http://127.0.0.1:4000/api/v1"
).replace(/\/api\/v1\/?$/, "");

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  // File static dari folder web (mis. /sauri/, /images/, /data/) → relative
  if (
    url.startsWith("/sauri/") ||
    url.startsWith("/images/") ||
    url.startsWith("/data/")
  ) {
    return url;
  }

  // File upload dari backend (/uploads/...) → prepend backend URL
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}
export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const selectedCategory = params.category?.trim() ?? "";
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  /* Fetch paralel */
  const [categoriesResult, productsResult] = await Promise.allSettled([
    getCategories(),
    getProducts({
      q: query || undefined,
      category: selectedCategory || undefined,
      limit: PAGE_SIZE * currentPage,
    }),
  ]);

  const categories: Category[] =
    categoriesResult.status === "fulfilled"
      ? extractApiList<Category>(categoriesResult.value)
      : [];

  const allProducts: Product[] =
    productsResult.status === "fulfilled"
      ? extractApiList<Product>(productsResult.value)
      : [];

  const productsError = productsResult.status === "rejected";

  /* Pagination sederhana — asumsi backend return list terurut */
  const totalShown = PAGE_SIZE * currentPage;
  const visibleProducts = allProducts.slice(0, totalShown);
  const hasMore = allProducts.length > totalShown;

  /* Build URL helper */
  const buildUrl = (overrides: {
    q?: string;
    category?: string;
    page?: number;
  }) => {
    const sp = new URLSearchParams();
    const q = overrides.q ?? query;
    const category = overrides.category ?? selectedCategory;
    const page = overrides.page ?? 1;

    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    if (page > 1) sp.set("page", String(page));

    return `/search${sp.toString() ? `?${sp.toString()}` : ""}`;
  };

  const totalCategories = categories.length;

  return (
    <main className="nd-marketplace">
      <div className="nd-content">
        {/* ================= HEADER / BREADCRUMB ================= */}
        <Reveal>
          <nav
            className="nd-breadcrumb"
            aria-label="Navigasi halaman"
            style={{ marginBottom: 16 }}
          >
            <Link href="/">Beranda</Link>
            <span aria-hidden="true">›</span>
            <span>Cari</span>
            {selectedCategory ? (
              <>
                <span aria-hidden="true">›</span>
                <span>{selectedCategory}</span>
              </>
            ) : null}
          </nav>
        </Reveal>

        {/* ================= HERO SEARCH ================= */}
        <Reveal>
          <section
            className="nd-search-hero"
            aria-labelledby="nd-search-title"
          >
            <span className="nd-pill">PENCARIAN PRODUK</span>

            <h1 id="nd-search-title">
              {query
                ? `Hasil untuk "${query}"`
                : "Cari produk, layanan, atau mitra usaha"}
            </h1>

            <p>
              {query
                ? `Menampilkan produk yang cocok dengan kata kunci "${query}".`
                : "Gunakan kata kunci atau filter kategori untuk menemukan produk yang kamu butuhkan."}
            </p>

            <div className="nd-search-bar-wrap">
              <SearchBar
                defaultValue={query}
                selectedCategory={selectedCategory}
              />
            </div>

            {selectedCategory ? (
              <div className="nd-active-filter">
                <span>Filter aktif:</span>
                <Link
                  href={buildUrl({ category: "", page: 1 })}
                  className="nd-active-filter__chip"
                >
                  {selectedCategory}
                  <span aria-hidden="true"> ×</span>
                </Link>
              </div>
            ) : null}
          </section>
        </Reveal>

        {/* ================= CATEGORY FILTER ================= */}
        {totalCategories > 0 ? (
          <Reveal>
            <section
              className="nd-cat-filter"
              aria-labelledby="nd-cat-filter-title"
            >
              <h2 id="nd-cat-filter-title" className="nd-sr-only">
                Filter kategori
              </h2>

              <div className="nd-cat-filter__chips">
                <Link
                  href={buildUrl({ category: "", page: 1 })}
                  className={`nd-chip${
                    !selectedCategory ? " is-active" : ""
                  }`}
                >
                  <span aria-hidden="true">🌐</span> Semua
                </Link>

                {categories.slice(0, 12).map((category) => {
                  const visual = getCategoryVisual(category);
                  const isActive =
                    category.slug === selectedCategory;

                  return (
                    <Link
                      key={String(category.id ?? category.slug)}
                      href={buildUrl({
                        category: category.slug ?? "",
                        page: 1,
                      })}
                      className={`nd-chip${isActive ? " is-active" : ""}`}
                    >
                      <span aria-hidden="true">{visual.icon}</span>{" "}
                      {visual.label}
                    </Link>
                  );
                })}
              </div>
            </section>
          </Reveal>
        ) : null}

        {/* ================= RESULT COUNT ================= */}
        <Reveal>
          <div className="nd-result-info">
            <span>
              {productsError ? (
                "Katalog sementara tidak tersedia"
              ) : visibleProducts.length === 0 ? (
                "Tidak ada produk ditemukan"
              ) : (
                <>
                  Menampilkan{" "}
                  <strong>{visibleProducts.length}</strong> produk
                  {query ? (
                    <>
                      {" "}
                      untuk <em>“{query}”</em>
                    </>
                  ) : null}
                </>
              )}
            </span>

            {(query || selectedCategory) && (
              <Link
                href="/search"
                className="nd-clear-filter"
              >
                Reset pencarian <span aria-hidden="true">×</span>
              </Link>
            )}
          </div>
        </Reveal>

        {/* ================= PRODUCT GRID ================= */}
        <Reveal delay={80}>
          <section aria-label="Daftar produk">
            {productsError ? (
              <EmptyState
                title="Katalog sementara tidak tersedia"
                description="Layanan katalog belum dapat dihubungi. Silakan coba lagi beberapa saat."
              />
            ) : visibleProducts.length === 0 ? (
              <EmptyState
                title={
                  query
                    ? `Tidak ada produk untuk "${query}"`
                    : "Tidak ada produk ditemukan"
                }
                description={
                  query
                    ? "Coba kata kunci lain, atau jelajahi kategori yang tersedia."
                    : "Coba pilih kategori lain atau reset filter pencarian."
                }
              />
            ) : (
              <div className="nd-product-grid">
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    key={
                      product.public_id ??
                      product.slug ??
                      `product-${index}`
                    }
                    product={product}
                  />
                ))}
              </div>
            )}

            {/* ================= LOAD MORE ================= */}
            {hasMore ? (
              <div className="nd-load-more-wrap">
                <Link
                  href={buildUrl({ page: currentPage + 1 })}
                  className="nd-load-more"
                >
                  Muat lebih banyak{" "}
                  <span aria-hidden="true">↓</span>
                </Link>
              </div>
            ) : visibleProducts.length > 0 ? (
              <div className="nd-load-more-wrap">
                <p className="nd-load-more-end">
                  Semua produk sudah ditampilkan
                </p>
              </div>
            ) : null}
          </section>
        </Reveal>

        {/* ================= NOTE ================= */}
        <Reveal>
          <div className="nd-marketplace-note">
            Informasi produk dan harga diperbarui langsung dari mitra
            usaha NUSA-DHIPA. Hubungi penjual untuk ketersediaan terkini.
          </div>
        </Reveal>
      </div>
    </main>
  );
}