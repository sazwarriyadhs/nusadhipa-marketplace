import Image from "next/image";
import Link from "next/link";
import MarketInsightSelector from "@/components/MarketInsightSelector";
import { Reveal } from "@/components/home/Reveal";
import { TrustStats } from "@/components/home/TrustStats";
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
  searchParams: Promise<{ q?: string; category?: string }>;
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

/* ---------- Kategori visual ---------- */

const categoryVisuals: Record<string, { image: string; label: string; num: number }> = {
  "makanan-minuman": { image: "/kategori/01-makanan-minuman.png", label: "Makanan & Minuman", num: 1 },
  "pertanian-hasil-bumi": { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Pertanian & Hasil Bumi", num: 2 },
  "peternakan-daging-perikanan": { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Peternakan, Daging & Perikanan", num: 3 },
  "petfood-kebutuhan-hewan": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Petfood & Kebutuhan Hewan", num: 4 },
  "fashion-aksesori": { image: "/kategori/05-fashion-aksesori.png", label: "Fashion & Aksesori", num: 5 },
  "kerajinan-produk-kreatif": { image: "/kategori/06-kerajinan-produk-kreatif.png", label: "Kerajinan & Produk Kreatif", num: 6 },
  "rumah-tangga-perlengkapan": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah Tangga & Perlengkapan", num: 7 },
  "kecantikan-perawatan-diri": { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kecantikan & Perawatan Diri", num: 8 },
  "tanaman-bunga-florist": { image: "/kategori/09-tanaman-bunga-florist.png", label: "Tanaman, Bunga & Florist", num: 9 },
  "elektronik-peralatan": { image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik & Peralatan", num: 10 },
  "jasa-layanan-bisnis": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa & Layanan Bisnis", num: 11 },
  "industri-grosir-b2b": { image: "/kategori/12-industri-grosir-b2b.png", label: "Industri, Grosir & B2B", num: 12 },

  // Fallback (icon emoji kalau gambar nggak ketemu)
  ayam: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Ayam", num: 3 },
  unggas: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Ayam & Unggas", num: 3 },
  ikan: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Ikan", num: 3 },
  daging: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Daging", num: 3 },
  petfood: { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Petfood", num: 4 },
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
    num: 0,
  };
}

/* ---------- Fallback kategori (module scope, bukan re-create tiap render) ---------- */

const fallbackCategories = [
  { slug: "makanan-minuman", image: "/kategori/01-makanan-minuman.png", label: "Makanan & Minuman" },
  { slug: "pertanian-hasil-bumi", image: "/kategori/02-pertanian-hasil-bumi.png", label: "Pertanian & Hasil Bumi" },
  { slug: "peternakan-daging-perikanan", image: "/kategori/03-peternakan-daging-perikanan.png", label: "Peternakan, Daging & Perikanan" },
  { slug: "petfood-kebutuhan-hewan", image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Petfood & Kebutuhan Hewan" },
  { slug: "fashion-aksesori", image: "/kategori/05-fashion-aksesori.png", label: "Fashion & Aksesori" },
  { slug: "kerajinan-produk-kreatif", image: "/kategori/06-kerajinan-produk-kreatif.png", label: "Kerajinan & Produk Kreatif" },
  { slug: "rumah-tangga-perlengkapan", image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah Tangga & Perlengkapan" },
  { slug: "kecantikan-perawatan-diri", image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kecantikan & Perawatan Diri" },
  { slug: "tanaman-bunga-florist", image: "/kategori/09-tanaman-bunga-florist.png", label: "Tanaman, Bunga & Florist" },
  { slug: "elektronik-peralatan", image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik & Peralatan" },
  { slug: "jasa-layanan-bisnis", image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa & Layanan Bisnis" },
  { slug: "industri-grosir-b2b", image: "/kategori/12-industri-grosir-b2b.png", label: "Industri, Grosir & B2B" },
] as const;

/* ---------- Sub-components ---------- */

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

/* ---------- Homepage ---------- */

const API_BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
  process.env.MARKETPLACE_API_URL ||
  "http://127.0.0.1:4000/api/v1"
).replace(/\/api\/v1\/?$/, "");

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (
    url.startsWith("/sauri/") ||
    url.startsWith("/images/") ||
    url.startsWith("/data/")
  ) {
    return url;
  }
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}
export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const selectedCategory = params.category?.trim() ?? "";

  /* Fetch paralel + aman kalau salah satu gagal */
  const [categoriesResult, productsResult, allProductsResult] =
    await Promise.allSettled([
      getCategories(),
      // Fetch 8 untuk display produk pilihan
      getProducts({
        q: query || undefined,
        category: selectedCategory || undefined,
        limit: 8,
      }),
      // Fetch 100 untuk hitung total (counter statistik)
      getProducts({ limit: 100 }),
    ]);

  const categories: Category[] =
    categoriesResult.status === "fulfilled"
      ? extractApiList<Category>(categoriesResult.value)
      : [];

  const products: Product[] =
    productsResult.status === "fulfilled"
      ? extractApiList<Product>(productsResult.value)
      : [];

  // Semua produk untuk counter (bukan cuma 8)
  const allProducts: Product[] =
    allProductsResult.status === "fulfilled"
      ? extractApiList<Product>(allProductsResult.value)
      : products;

  const categoriesError = categoriesResult.status === "rejected";
  const productsError = productsResult.status === "rejected";

  const popularCategories = categories.slice(0, 6);
  const displayCategories = categories.length > 0 ? categories : [];

  /* Trust stats — pakai data semua produk */
  const totalProducts = allProducts.length;
  const totalSellers = new Set(
    allProducts.map((p) => p.business_name).filter(Boolean),
  ).size;

  return (
    <main className="nd-marketplace">
      <div className="nd-content">
        {/* ================= HERO ================= */}
        <section
          className="nd-hero nd-hero--fullbleed"
          aria-labelledby="nd-hero-title"
        >
          <div className="nd-hero__bg">
            <Image
              src="/images/header_image.jpg"
              alt="NUSA-DHIPA Marketplace — ekosistem usaha Indonesia"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <div className="nd-hero__overlay" aria-hidden="true" />
          </div>

          <div className="nd-hero__content">
            <span className="nd-pill">MARKETPLACE UMKM INDONESIA</span>

            <h1 id="nd-hero-title" className="nd-hero__title">
              Cari produk, layanan,
              <br />
              atau peluang usaha.
            </h1>

            <p className="nd-hero__subtitle">
              Temukan produk berkualitas, pemasok, dan mitra bisnis
              tepercaya dalam satu ekosistem usaha Indonesia.
            </p>

            <SearchBar
              defaultValue={query}
              selectedCategory={selectedCategory}
            />

            <div className="nd-hero__chips" aria-label="Kategori populer">
              {popularCategories.length > 0
                ? popularCategories.map((category) => {
                    const visual = getCategoryVisual(category);

                    return (
                      <Link
                        key={String(category.id ?? category.slug)}
                        href={`/search?category=${encodeURIComponent(
                          category.slug ?? "",
                        )}`}
                      >
                        <span aria-hidden="true">🛍️</span>
                        {visual.label}
                      </Link>
                    );
                  })
                : fallbackCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/search?category=${encodeURIComponent(
                        category.slug,
                      )}`}
                    >
                      <span aria-hidden="true">🛍️</span>
                      {category.label}
                    </Link>
                  ))}
            </div>

            {categoriesError ? (
              <p className="nd-inline-notice">
                Kategori belum dapat diperbarui. Kategori populer tetap
                tersedia untuk dijelajahi.
              </p>
            ) : null}
          </div>
        </section>

        {/* ================= CATEGORY GRID (BARU) ================= */}
        {displayCategories.length > 0 ? (
          <Reveal>
            <section
              className="nd-cat-grid-section"
              aria-labelledby="nd-cat-title"
            >
              <div className="nd-section-heading">
                <div>
                  <span className="nd-eyebrow">JELAJAHI KATEGORI</span>
                  <h2 id="nd-cat-title">Pilih kategori favoritmu</h2>
                  <p>
                    Temukan produk berdasarkan kategori yang paling
                    relevan dengan kebutuhanmu.
                  </p>
                </div>

                <Link href="/search" className="nd-section-link">
                  Semua kategori <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="nd-cat-grid">
                {displayCategories.slice(0, 8).map((category) => {
                  const visual = getCategoryVisual(category);

                  return (
                    <Link
                      key={String(category.id ?? category.slug)}
                      href={`/search?category=${encodeURIComponent(
                        category.slug ?? "",
                      )}`}
                      className="nd-cat-card"
                    >
                      <span className="nd-cat-card__num">{visual.num}</span>
                      <img
                        src={visual.image}
                        alt={visual.label}
                        className="nd-cat-card__image"
                        loading="lazy"
                      />
                      <strong>{visual.label}</strong>
                      <small>Lihat produk</small>
                    </Link>
                  );
                })}
              </div>
            </section>
          </Reveal>
        ) : (
          <Reveal>
            <section
              className="nd-cat-grid-section"
              aria-labelledby="nd-cat-title-fallback"
            >
              <div className="nd-section-heading">
                <div>
                  <span className="nd-eyebrow">JELAJAHI KATEGORI</span>
                  <h2 id="nd-cat-title-fallback">Kategori populer</h2>
                  <p>
                    Mulai dari kategori yang paling sering dicari pembeli.
                  </p>
                </div>
              </div>

              <div className="nd-cat-grid">
                {fallbackCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/search?category=${encodeURIComponent(
                      category.slug,
                    )}`}
                    className="nd-cat-card"
                  >
                    <span className="nd-cat-card__num">
                      {fallbackCategories.findIndex(c => c.slug === category.slug) + 1}
                    </span>
                    <img
                      src={category.image || "/kategori/01-makanan-minuman.png"}
                      alt={category.label}
                      className="nd-cat-card__image"
                      loading="lazy"
                    />
                    <strong>{category.label}</strong>
                    <small>Lihat produk</small>
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ================= MARKET INSIGHT ================= */}
        <Reveal>
          <section
            className="nd-market-insight"
            aria-labelledby="nd-market-insight-title"
          >
            <div className="nd-section-heading nd-market-insight__heading">
              <div>
                <span className="nd-eyebrow">DATA PASAR & PANGAN</span>
                <h2 id="nd-market-insight-title">
                  Market Insight & Harga Pangan
                </h2>
                <p>
                  Pantau informasi harga pangan berdasarkan sumber dan
                  waktu pembaruan yang tersedia.
                </p>
              </div>

              <span className="nd-live-label">
                <i aria-hidden="true" />
                Informasi harga
              </span>
            </div>

            <div className="nd-insight-slot">
              <MarketInsightSelector />
            </div>
          </section>
        </Reveal>

        {/* ================= TRUST STATS (BARU) ================= */}
        <Reveal delay={80}>
          <TrustStats
            totalProducts={totalProducts}
            totalSellers={totalSellers}
          />
        </Reveal>

        {/* ================= PRODUCTS ================= */}
        <Reveal delay={120}>
          <section
            className="nd-section"
            id="produk"
            aria-labelledby="nd-products-title"
          >
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">KATALOG MARKETPLACE</span>
                <h2 id="nd-products-title">
                  {query ? `Hasil pencarian: ${query}` : "Produk Pilihan"}
                </h2>
                <p>
                  Jelajahi produk berdasarkan informasi katalog yang
                  tersedia.
                </p>
              </div>

              <Link href="/search" className="nd-section-link">
                Lihat semua <span aria-hidden="true">→</span>
              </Link>
            </div>

            {productsError ? (
              <EmptyState
                title="Katalog sementara tidak tersedia"
                description="Layanan katalog belum dapat dihubungi. Silakan coba lagi beberapa saat."
              />
            ) : products.length === 0 ? (
              <EmptyState
                title={
                  query
                    ? "Produk tidak ditemukan"
                    : "Katalog sedang dipersiapkan"
                }
                description={
                  query
                    ? "Coba kata kunci lain atau jelajahi seluruh katalog."
                    : "Produk akan ditampilkan setelah tersedia di katalog marketplace."
                }
              />
            ) : (
              <div className="nd-product-grid">
                {products.slice(0, 8).map((product, index) => (
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
          </section>
        </Reveal>

        {/* ================= PROMO ================= */}
        <Reveal>
          <section
            className="nd-promo-banner"
            aria-labelledby="nd-promo-title"
          >
            <div className="nd-promo-banner__icon" aria-hidden="true">
              %
            </div>

            <div>
              <span>PROMO & PELUANG USAHA</span>
              <h2 id="nd-promo-title">
                Belanja lebih cerdas, bisnis makin berkembang.
              </h2>
              <p>
                Jelajahi penawaran dan temukan mitra yang sesuai
                kebutuhanmu.
              </p>
            </div>

            <Link href="/promo">
              Jelajahi promo <span aria-hidden="true">→</span>
            </Link>
          </section>
        </Reveal>

        {/* ================= BUSINESS BANNER ================= */}
        <Reveal>
          <section
            className="nd-business-banner"
            aria-labelledby="nd-business-title"
          >
            <div className="nd-business-banner__symbol" aria-hidden="true">
              🤝
            </div>

            <div>
              <span className="nd-eyebrow">GABUNG EKOSISTEM NUSA-DHIPA</span>
              <h2 id="nd-business-title">Jadi Mitra Bisnis NUSA-DHIPA</h2>
              <p>
                Perluas jangkauan produk, bangun koneksi, dan temukan
                peluang kerja sama dengan pelaku usaha lainnya.
              </p>
            </div>

            <Link href="/umkm">
              Jelajahi mitra <span aria-hidden="true">→</span>
            </Link>
          </section>
        </Reveal>

        <div className="nd-marketplace-note">
          Informasi produk, harga, stok, dan identitas usaha mengikuti
          data yang tersedia dari sumber terkait.
        </div>
      </div>
    </main>
  );
}