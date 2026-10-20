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
import { getSauriImage, getCategoryImage } from "@/lib/sauri-images";

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

const categoryVisuals: Record<string, { image: string; label: string }> = {
  "makanan-minuman": { image: "/kategori/01-makanan-minuman.png", label: "Makanan & Minuman" },
  "pertanian-hasil-bumi": { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Pertanian & Hasil Bumi" },
  "peternakan-daging-perikanan": { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Peternakan, Daging & Perikanan" },
  "petfood-kebutuhan-hewan": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Petfood & Kebutuhan Hewan" },
  "fashion-aksesori": { image: "/kategori/05-fashion-aksesori.png", label: "Fashion & Aksesori" },
  "kerajinan-produk-kreatif": { image: "/kategori/06-kerajinan-produk-kreatif.png", label: "Kerajinan & Produk Kreatif" },
  "rumah-tangga-perlengkapan": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah Tangga & Perlengkapan" },
  "kecantikan-perawatan-diri": { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kecantikan & Perawatan Diri" },
  "tanaman-bunga-florist": { image: "/kategori/09-tanaman-bunga-florist.png", label: "Tanaman, Bunga & Florist" },
  "elektronik-peralatan": { image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik & Peralatan" },
  "jasa-layanan-bisnis": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa & Layanan Bisnis" },
  "industri-grosir-b2b": { image: "/kategori/12-industri-grosir-b2b.png", label: "Industri, Grosir & B2B" },
  // Fallback
  ayam: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Ayam" },
  ikan: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Ikan" },
  petfood: { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Petfood" },
  daging: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Daging" },
};

function getCategoryVisual(category: Category) {
  const slug = (category.slug ?? "").toLowerCase().trim();
  const exact = categoryVisuals[slug];
  if (exact) return exact;

  const name = (category.name ?? "").toLowerCase().trim();
  const fallback = categoryVisuals[name];
  if (fallback) return fallback;

  return {
    image: "/kategori/01-makanan-minuman.png",
    label: category.name || "Lainnya",
  };
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

  // Fallback: gambar kategori
  const fallbackImage = getCategoryFallbackImage(product.category_slug ?? "");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fallbackImage}
      alt={product.category_name ?? product.name}
      className="nd-product-image nd-product-image--fallback"
      loading="lazy"
    />
  );
}

// ============================================================
// Fallback: Estimasi Harga Pasaran + Gambar Kategori
// ============================================================

const MARKET_PRICE_ESTIMATES: Record<string, { min: number; max: number }> = {
  "ayam-utuh": { min: 35000, max: 42000 },
  "ayam-karkas": { min: 35000, max: 42000 },
  "boneless-dada": { min: 45000, max: 55000 },
  "boneless-paha": { min: 42000, max: 50000 },
  "paha-pentung": { min: 35000, max: 42000 },
  "sayap": { min: 32000, max: 38000 },
  "ceker": { min: 20000, max: 26000 },
  "kepala": { min: 15000, max: 22000 },
  "jantung": { min: 25000, max: 35000 },
  "hati": { min: 25000, max: 35000 },
  "ampela": { min: 25000, max: 35000 },
  "usus": { min: 15000, max: 20000 },
  "tulang": { min: 10000, max: 15000 },
  "kulit": { min: 18000, max: 25000 },
  "tunggir": { min: 20000, max: 28000 },
  "krokong": { min: 18000, max: 25000 },
  "ikan": { min: 25000, max: 45000 },
  "tuna": { min: 40000, max: 65000 },
  "fillet": { min: 50000, max: 80000 },
  "dori": { min: 45000, max: 65000 },
  "kakap": { min: 55000, max: 85000 },
  "tenggiri": { min: 60000, max: 90000 },
  "udang": { min: 70000, max: 120000 },
  "pakan-kucing": { min: 25000, max: 80000 },
  "pakan-anjing": { min: 30000, max: 90000 },
  "pakan-ikan": { min: 15000, max: 45000 },
  "pakan-ternak": { min: 8000, max: 25000 },
  "tepung-ikan": { min: 12000, max: 18000 },
  "minyak-ikan": { min: 20000, max: 35000 },
};

function getMarketEstimate(product: Product): { min: number; max: number } | null {
  const key = `${product.slug ?? ""} ${product.name ?? ""}`.toLowerCase();
  for (const [needle, estimate] of Object.entries(MARKET_PRICE_ESTIMATES)) {
    if (key.includes(needle)) return estimate;
  }
  return null;
}

function formatPriceRange(product: Product): string {
  const min = Number(product.min_price) || 0;
  const max = Number(product.max_price) || 0;
  const isPhysical = product.product_type === "physical";

  if (min > 0) {
    const per500 = isPhysical ? min / 2 : min;
    const unit = isPhysical ? " / 500 gram" : "";
    if (max > 0 && max !== min) {
      return `Mulai dari ${formatRupiah(per500)}${unit}`;
    }
    return `${formatRupiah(per500)}${unit}`;
  }

  const estimate = getMarketEstimate(product);
  if (estimate) {
    const per500 = isPhysical ? estimate.min / 2 : estimate.min;
    const per500Max = isPhysical ? estimate.max / 2 : estimate.max;
    return `Estimasi ${formatRupiah(per500)} – ${formatRupiah(per500Max)} / 500 gram`;
  }

  return "Harga menyusul";
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "makanan-minuman": "/kategori/01-makanan-minuman.png",
  "pertanian-hasil-bumi": "/kategori/02-pertanian-hasil-bumi.png",
  "peternakan-daging-perikanan": "/kategori/03-peternakan-daging-perikanan.png",
  "petfood-kebutuhan-hewan": "/kategori/04-petfood-kebutuhan-hewan.png",
  "fashion-aksesori": "/kategori/05-fashion-aksesori.png",
  "kerajinan-produk-kreatif": "/kategori/06-kerajinan-produk-kreatif.png",
  "rumah-tangga-perlengkapan": "/kategori/07-rumah-tangga-perlengkapan.png",
  "kecantikan-perawatan-diri": "/kategori/08-kecantikan-perawatan-diri.png",
  "tanaman-bunga-florist": "/kategori/09-tanaman-bunga-florist.png",
  "elektronik-peralatan": "/kategori/10-elektronik-peralatan.png",
  "jasa-layanan-bisnis": "/kategori/11-jasa-layanan-bisnis.png",
  "industri-grosir-b2b": "/kategori/12-industri-grosir-b2b.png",
};

function getCategoryFallbackImage(categorySlug: string): string {
  return CATEGORY_FALLBACK_IMAGES[categorySlug] ?? "/kategori/01-makanan-minuman.png";
}

// ============================================================

function ProductCard({ product }: { product: Product }) {
  const href = `/produk/${encodeURIComponent(product.slug)}`;

  const price = formatPriceRange(product);

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

          {product.min_retail_price != null || product.min_b2b_price != null ? (
            <div className="nd-product-card__pricing">
              {product.min_retail_price != null ? (
                <div className="nd-price-block nd-price-block--retail">
                  <span className="nd-price-label">🛒 Eceran</span>
                  <span className="nd-price-value">
                    {formatRupiah(product.min_retail_price)}
                  </span>
                  <span className="nd-price-unit">/kg</span>
                </div>
              ) : null}

              {product.min_b2b_price != null ? (
                <div className="nd-price-block nd-price-block--b2b">
                  <span className="nd-price-label">🏭 Grosir</span>
                  <span className="nd-price-value nd-price-value--b2b">
                    {formatRupiah(product.min_b2b_price)}
                  </span>
                  <span className="nd-price-unit">/kg</span>
                  {product.min_b2b_kg ? (
                    <span className="nd-price-min">
                      min {product.min_b2b_kg}kg
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <p
              className={
d-product-card__price${
                product.min_price == null ? " is-unset" : ""
              }`}
            >
              {price}
            </p>
          )}

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
                  className={
d-chip${
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
                      className={
d-chip nd-chip--with-image${isActive ? " is-active" : ""}`}
                    >
                      <img
                        src={visual.image}
                        alt=""
                        className="nd-chip__icon"
                        width={20}
                        height={20}
                        loading="lazy"
                      />
                      <span>{visual.label}</span>
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


