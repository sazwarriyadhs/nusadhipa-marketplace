import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import {
  getBusinessBySlug,
  getProducts,
  formatRupiah,
  type Product,
  type BusinessInfo,
} from "@/lib/marketplace-api";
import { getSauriImage, getCategoryImage } from "@/lib/sauri-images";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/* ---------- Helpers ---------- */

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

function extractApiList<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];
  if (!response || typeof response !== "object") return [];
  const result = response as Record<string, unknown>;
  for (const key of ["items", "data", "results", "products", "rows"]) {
    const value = result[key];
    if (Array.isArray(value)) return value as T[];
    if (value && typeof value === "object") {
      const nested = extractApiList<T>(value);
      if (nested.length > 0) return nested;
    }
  }
  return [];
}

function ProductCard({ product }: { product: Product }) {
  const originalImageUrl = resolveImageUrl(product.image_url);
  // Prioritas 1: Gambar dari nama produk
  const fallbackByProduct = getSauriImage(product.name);
  // Prioritas 2: Gambar dari kategori
  const fallbackByCategory = getCategoryImage(product.category_name);
  
  const imageUrl = originalImageUrl || fallbackByProduct || fallbackByCategory;
  const href = `/produk/${encodeURIComponent(product.slug)}`;

  const price =
    product.min_price == null
      ? "Harga belum tersedia"
      : product.max_price != null && product.max_price !== product.min_price
        ? `${formatRupiah(product.min_price)} - ${formatRupiah(product.max_price)}`
        : formatRupiah(product.min_price);

  return (
    <Link href={href} className="nd-store-product-card">
      <div className="nd-store-product-card__media">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={product.name} />
        ) : (
          <div className="nd-store-product-card__empty">
            <span aria-hidden="true">{"\uD83D\uDECD\uFE0F"}</span>
            <small>Foto belum tersedia</small>
          </div>
        )}
        {product.category_name && (
          <span className="nd-store-product-card__tag">
            {product.category_name}
          </span>
        )}
      </div>
      <div className="nd-store-product-card__body">
        <h3>{product.name}</h3>
        <p className="nd-store-product-card__price">{price}</p>
        {product.available_stock != null && (
          <p className="nd-store-product-card__stock">
            Stok: {product.available_stock}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ---------- Page ---------- */

export default async function StoreProfilePage({ params }: PageProps) {
  const { slug } = await params;

  const businessResult = await getBusinessBySlug(slug).catch(() => null);
  
  if (!businessResult || businessResult.slug !== slug) {
    return (
      <main className="nd-store-profile">
        <div className="nd-store-empty-page">
          <span style={{ fontSize: "3rem" }}>{"\uD83C\uDFEA"}</span>
          <h1>Toko tidak ditemukan</h1>
          <p>Toko dengan alamat ini belum terdaftar.</p>
          <Link href="/umkm" className="nd-store-btn-primary">
            Kembali ke Direktori Mitra
          </Link>
        </div>
      </main>
    );
  }

  const productsResult = await getProducts({ 
    businessSlug: slug, 
    limit: 100 
  }).catch(() => []);

  const business: BusinessInfo | null = businessResult;
  const products: Product[] = extractApiList<Product>(productsResult);

  const business: BusinessInfo | null =
    businessResult.status === "fulfilled" ? businessResult.value : null;

  const allProducts: Product[] =
    productsResult.status === "fulfilled"
      ? extractApiList<Product>(productsResult.value)
      : [];

  

  const categories = Array.from(
    new Set(products.map((p) => p.category_name).filter(Boolean)),
  ).slice(0, 6);

  const bannerUrl = resolveImageUrl(business?.banner_url);
  const logoUrl = resolveImageUrl(business?.logo_url);
  const isVerified = business?.verification_status === "verified";



  return (
    <main className="nd-store-profile">
      <div className="nd-content">
        <Reveal>
          <nav className="nd-breadcrumb" aria-label="Navigasi" style={{ marginBottom: 16 }}>
            <Link href="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            <Link href="/umkm">Mitra Usaha</Link>
            <span aria-hidden="true">/</span>
            <span>{business?.business_name ?? "Toko"}</span>
          </nav>
        </Reveal>

        <Reveal>
          <section className="nd-store-hero">
            {/* ===== BANNER ===== */}
            <div className="nd-store-hero__banner">
              {bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bannerUrl} alt={business?.business_name ?? "Toko"} />
              ) : (
                <div className="nd-store-hero__banner-placeholder" />
              )}
              <div className="nd-store-hero__overlay" />

              {/* Badge & nama di ATAS banner */}
              <div className="nd-store-hero__banner-content">
                {isVerified && (
                  <span className="nd-store-badge-glass">
                    {"\u2713"} UMKM Terverifikasi
                  </span>
                )}
                <h1 className="nd-store-hero__banner-title">
                  {business?.business_name ?? "Toko"}
                </h1>
                {business?.legal_name && (
                  <p className="nd-store-hero__banner-legal">
                    {business.legal_name}
                  </p>
                )}
              </div>
            </div>

            {/* ===== INFO DI BAWAH BANNER ===== */}
            <div className="nd-store-hero__info">
              <div className="nd-store-hero__logo">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt={business?.business_name ?? "Logo"} />
                ) : (
                  <span>{"\uD83C\uDFEA"}</span>
                )}
              </div>

              <div className="nd-store-hero__text">
                <div className="nd-store-hero__meta">
                  {business?.city && (
                    <span>
                      {"\uD83D\uDCCD"} {business.city}
                      {business.province ? `, ${business.province}` : ""}
                    </span>
                  )}
                  {business?.phone && (
                    <span>{"\uD83D\uDCDE"} {business.phone}</span>
                  )}
                  {business?.email && (
                    <span>{"\u2709\uFE0F"} {business.email}</span>
                  )}
                </div>
                {business?.nib && (
                  <div className="nd-store-hero__legal-info">
                    <span>NIB: {business.nib}</span>
                    {business.tax_number && (
                      <span>NPWP: {business.tax_number}</span>
                    )}
                  </div>
                )}

                {/* ===== QUICK ACTIONS ===== */}
                <div className="nd-store-actions">
                  {business?.phone && (
                    <a
                      href={`https://wa.me/${business.phone.replace(/\D/g, "").replace(/^0/, "62")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nd-store-action nd-store-action--wa"
                    >
                      {"\uD83D\uDCAC"} Chat WhatsApp
                    </a>
                  )}
                  {business?.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="nd-store-action nd-store-action--call"
                    >
                      {"\uD83D\uDCDE"} Telepon
                    </a>
                  )}
                  <button
                    type="button"
                    className="nd-store-action nd-store-action--follow"
                  >
                    {"\u2B50"} Follow Toko
                  </button>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={40}>
          <section className="nd-store-stats">
            <div className="nd-store-stat">
              <span className="nd-store-stat__icon">{"\uD83D\uDCE6"}</span>
              <strong>{products.length}</strong>
              <small>Produk</small>
            </div>
            <div className="nd-store-stat">
              <span className="nd-store-stat__icon">{"\uD83C\uDFF7\uFE0F"}</span>
              <strong>{categories.length}</strong>
              <small>Kategori</small>
            </div>
            <div className="nd-store-stat">
              <span className="nd-store-stat__icon">{"\u2705"}</span>
              <strong>{isVerified ? "Verified" : "Aktif"}</strong>
              <small>Status</small>
            </div>
            <div className="nd-store-stat">
              <span className="nd-store-stat__icon">{"\uD83C\uDFEA"}</span>
              <strong>UMKM</strong>
              <small>Tipe Usaha</small>
            </div>
          </section>
        </Reveal>

        {categories.length > 0 && (
          <Reveal delay={60}>
            <section style={{ marginTop: 24 }}>
              <h2 className="nd-store-section-title">Kategori Produk</h2>
              <div className="nd-store-categories">
                {categories.map((cat) => (
                  <span key={cat} className="nd-store-category-chip">
                    {cat}
                  </span>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        <Reveal delay={80}>
          <section className="nd-store-products-section">
            <div className="nd-store-section-heading">
              <div>
                <span className="nd-eyebrow">KATALOG TOKO</span>
                <h2 className="nd-store-section-title">
                  Produk dari {business?.business_name ?? "toko ini"}
                </h2>
                <p className="nd-store-section-subtitle">
                  {products.length} produk tersedia - eceran &amp; grosir
                </p>
              </div>
              <Link href="/search" className="nd-store-view-all">
                Lihat semua produk
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="nd-store-empty">
                <span aria-hidden="true">{"\uD83D\uDCE6"}</span>
                <p>Toko ini belum menambahkan produk.</p>
              </div>
            ) : (
              <div className="nd-store-products-grid">
                {products.slice(0, 24).map((product, idx) => (
                  <ProductCard
                    key={product.public_id ?? product.slug ?? `p-${idx}`}
                    product={product}
                  />
                ))}
              </div>
            )}
          </section>
        </Reveal>
      </div>
    </main>
  );
}



