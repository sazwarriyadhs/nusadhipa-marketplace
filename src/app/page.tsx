import Image from "next/image";
import Link from "next/link";
import MarketInsightSelector from "@/components/MarketInsightSelector";
import { Reveal } from "@/components/home/Reveal";
import { TrustStats } from "@/components/home/TrustStats";
import { SearchBar } from "@/components/home/SearchBar";
import {
  formatRupiah,
  getBusinesses,
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
  // 01 - Makanan & Minuman
  makanan: { image: "/kategori/01-makanan-minuman.png", label: "Makanan", num: 1 },
  minuman: { image: "/kategori/01-makanan-minuman.png", label: "Minuman", num: 1 },
  "makanan-minuman": { image: "/kategori/01-makanan-minuman.png", label: "Makanan & Minuman", num: 1 },
  "makanan-olahan": { image: "/kategori/01-makanan-minuman.png", label: "Makanan Olahan", num: 1 },
  sembako: { image: "/kategori/01-makanan-minuman.png", label: "Sembako", num: 1 },
  
  // 02 - Pertanian & Hasil Bumi
  pertanian: { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Pertanian", num: 2 },
  "pertanian-hasil-bumi": { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Pertanian & Hasil Bumi", num: 2 },
  "hasil-pertanian": { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Hasil Pertanian", num: 2 },
  bibit: { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Bibit & Benih", num: 2 },
  "bibit-benih": { image: "/kategori/02-pertanian-hasil-bumi.png", label: "Bibit & Benih", num: 2 },
  
  // 03 - Peternakan, Daging & Perikanan
  peternakan: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Peternakan", num: 3 },
  daging: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Daging", num: 3 },
  unggas: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Unggas", num: 3 },
  "peternakan-daging-perikanan": { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Peternakan, Daging & Perikanan", num: 3 },
  "daging-unggas": { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Daging & Unggas", num: 3 },
  ikan: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Ikan", num: 3 },
  "ikan-seafood": { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Ikan & Seafood", num: 3 },
  seafood: { image: "/kategori/03-peternakan-daging-perikanan.png", label: "Seafood", num: 3 },
  
  // 04 - Petfood & Kebutuhan Hewan
  petfood: { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Petfood", num: 4 },
  "petfood-kebutuhan-hewan": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Petfood & Kebutuhan Hewan", num: 4 },
  "hewan-peliharaan": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Hewan Peliharaan", num: 4 },
  "perlengkapan-hewan": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Perlengkapan Hewan", num: 4 },
  pakan: { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Pakan", num: 4 },
  "pakan-ternak": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Pakan Ternak", num: 4 },
  "pakan-kucing": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Pakan Kucing", num: 4 },
  "pakan-anjing": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Pakan Anjing", num: 4 },
  "pakan-ikan": { image: "/kategori/04-petfood-kebutuhan-hewan.png", label: "Pakan Ikan", num: 4 },
  
  // 05 - Fashion & Aksesori
  fashion: { image: "/kategori/05-fashion-aksesori.png", label: "Fashion", num: 5 },
  "fashion-aksesori": { image: "/kategori/05-fashion-aksesori.png", label: "Fashion & Aksesori", num: 5 },
  pakaian: { image: "/kategori/05-fashion-aksesori.png", label: "Pakaian", num: 5 },
  "aksesori-fashion": { image: "/kategori/05-fashion-aksesori.png", label: "Aksesori Fashion", num: 5 },
  "alas-kaki": { image: "/kategori/05-fashion-aksesori.png", label: "Alas Kaki", num: 5 },
  
  // 06 - Kerajinan & Produk Kreatif
  kerajinan: { image: "/kategori/06-kerajinan-produk-kreatif.png", label: "Kerajinan", num: 6 },
  "kerajinan-produk-kreatif": { image: "/kategori/06-kerajinan-produk-kreatif.png", label: "Kerajinan & Produk Kreatif", num: 6 },
  
  // 07 - Rumah Tangga & Perlengkapan
  rumah: { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah", num: 7 },
  "rumah-perlengkapan": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah & Perlengkapan", num: 7 },
  "rumah-tangga-perlengkapan": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Rumah Tangga & Perlengkapan", num: 7 },
  "peralatan-rumah": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Peralatan Rumah", num: 7 },
  "peralatan-dapur": { image: "/kategori/07-rumah-tangga-perlengkapan.png", label: "Peralatan Dapur", num: 7 },
  
  // 08 - Kecantikan & Perawatan Diri
  kecantikan: { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kecantikan", num: 8 },
  "kesehatan-kecantikan": { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kesehatan & Kecantikan", num: 8 },
  "kecantikan-perawatan-diri": { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Kecantikan & Perawatan Diri", num: 8 },
  "perawatan-diri": { image: "/kategori/08-kecantikan-perawatan-diri.png", label: "Perawatan Diri", num: 8 },
  
  // 09 - Tanaman, Bunga & Florist
  tanaman: { image: "/kategori/09-tanaman-bunga-florist.png", label: "Tanaman", num: 9 },
  "tanaman-bunga-florist": { image: "/kategori/09-tanaman-bunga-florist.png", label: "Tanaman, Bunga & Florist", num: 9 },
  
  // 10 - Elektronik & Peralatan
  elektronik: { image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik", num: 10 },
  "elektronik-digital": { image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik & Digital", num: 10 },
  "elektronik-peralatan": { image: "/kategori/10-elektronik-peralatan.png", label: "Elektronik & Peralatan", num: 10 },
  "aksesori-elektronik": { image: "/kategori/10-elektronik-peralatan.png", label: "Aksesori Elektronik", num: 10 },
  "produk-digital": { image: "/kategori/10-elektronik-peralatan.png", label: "Produk Digital", num: 10 },
  
  // 11 - Jasa & Layanan Bisnis
  jasa: { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa", num: 11 },
  "jasa-layanan": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa & Layanan", num: 11 },
  "jasa-profesional": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa Profesional", num: 11 },
  "jasa-bisnis": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa Bisnis", num: 11 },
  "jasa-layanan-bisnis": { image: "/kategori/11-jasa-layanan-bisnis.png", label: "Jasa & Layanan Bisnis", num: 11 },
  
  // 12 - Industri, Grosir & B2B
  industri: { image: "/kategori/12-industri-grosir-b2b.png", label: "Industri", num: 12 },
  "industri-grosir-b2b": { image: "/kategori/12-industri-grosir-b2b.png", label: "Industri, Grosir & B2B", num: 12 },
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

function getPriceUnitLabel(unit: string | null | undefined): string {
  const normalized = (unit ?? "unit").trim().toLowerCase();
  const labels: Record<string, string> = {
    kg: "/kg",
    gram: "/gram",
    g: "/gram",
    unit: "/unit",
    pcs: "/pcs",
    pc: "/pcs",
    piece: "/unit",
    pieces: "/unit",
    package: "/paket",
    pack: "/paket",
    paket: "/paket",
    liter: "/liter",
    l: "/liter",
    meter: "/meter",
    m: "/meter",
  };
  return labels[normalized] ?? `/${normalized || "unit"}`;
}

function ProductCard({ product }: { product: Product }) {
  const href = `/produk/${encodeURIComponent(product.slug)}`;

  const price = formatPriceRange(product);
  const unitLabel = getPriceUnitLabel(product.selling_unit);
  const isKgBased = (product.selling_unit ?? "").trim().toLowerCase() === "kg";

  const hasStock =
    product.available_stock != null && Number(product.available_stock) > 0;

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
              Tersedia
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
                  <span className="nd-price-unit">{unitLabel}</span>
                </div>
              ) : null}

              {product.min_b2b_price != null ? (
                <div className="nd-price-block nd-price-block--b2b">
                  <span className="nd-price-label">🏭 Grosir</span>
                  <span className="nd-price-value nd-price-value--b2b">
                    {formatRupiah(product.min_b2b_price)}
                  </span>
                  <span className="nd-price-unit">/kg</span>
                  {isKgBased && product.min_b2b_kg ? (
                    <span className="nd-price-min">
                      min {product.min_b2b_kg}kg
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <p
              className={`nd-product-card__price${
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
              Stok tersedia
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
  const [categoriesResult, productsResult, allProductsResult, businessesResult] =
    await Promise.allSettled([
      getCategories(),
      // Fetch 8 untuk display produk pilihan
      getProducts({
        q: query || undefined,
        category: selectedCategory || undefined,
        limit: 8,
      }),
      // Pagination.total adalah jumlah katalog, bukan jumlah item pada satu halaman.
      getProducts({ limit: 100 }),
      getBusinesses(),
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

  /* Statistik menggunakan total katalog API, bukan jumlah baris di satu halaman. */
  const totalProducts =
    allProductsResult.status === "fulfilled"
      ? Number(allProductsResult.value.pagination?.total ?? allProducts.length)
      : allProducts.length;
  const businesses =
    businessesResult.status === "fulfilled" ? businessesResult.value : [];
  const totalSellers =
    businesses.length ||
    new Set(allProducts.map((p) => p.business_name).filter(Boolean)).size;

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
