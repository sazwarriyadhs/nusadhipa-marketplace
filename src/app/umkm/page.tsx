import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import { getProducts, getBusinessInfo, type Product, type BusinessInfo } from "@/lib/marketplace-api";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; provinsi?: string }>;
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
    "businesses",
    "sellers",
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


/* ---------- Helper: resolve image URL ---------- */
const API_BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
  process.env.MARKETPLACE_API_URL ||
  "http://127.0.0.1:4000/api/v1"
).replace(/\/api\/v1\/?$/, "");

function resolveImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

/* ---------- Types ---------- */

type SellerInfo = {
  name: string;
  slug: string;
  productCount: number;
  categories: Set<string>;
  sampleSlug?: string;
  sampleImage?: string;
  logoUrl?: string;
};

function buildSellers(products: Product[]): SellerInfo[] {
  const map = new Map<string, SellerInfo>();

  for (const p of products) {
    const name = p.business_name?.trim();
    if (!name) continue;

    const existing = map.get(name);
    if (existing) {
      existing.productCount += 1;
      if (p.category_name) existing.categories.add(p.category_name);
      if (!existing.sampleImage && p.image_url) {
        existing.sampleImage = p.image_url;
        existing.sampleSlug = p.slug;
      }
    } else {
      map.set(name, {
        name,
        slug: p.business_slug ?? "",
        productCount: 1,
        categories: new Set(p.category_name ? [p.category_name] : []),
        sampleSlug: p.slug,
        sampleImage: p.image_url ?? undefined,
      });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.productCount - a.productCount,
  );
}

/* ---------- Components ---------- */

function SellerAvatar({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string;
}) {
  // Kalau ada logo dari business → tampilkan
  if (logoUrl) {
    return (
      <span
        className="nd-seller-avatar nd-seller-avatar--image"
        aria-hidden="true"
      >
        <img
          src={logoUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </span>
    );
  }

  // Fallback inisial
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span className="nd-seller-avatar" aria-hidden="true">
      {initials || "🏪"}
    </span>
  );
}

function SellerCard({ seller }: { seller: SellerInfo }) {
  const href = seller.slug
    ? `/umkm/${encodeURIComponent(seller.slug)}`
    : "/umkm";

  const categoriesList = Array.from(seller.categories).slice(0, 3);

  return (
    <article className="nd-seller-card">
      <div className="nd-seller-card__head">
        <SellerAvatar name={seller.name} logoUrl={seller.logoUrl} />
        <div className="nd-seller-card__title">
          <h3>{seller.name}</h3>
          <span className="nd-seller-card__badge">
            <span aria-hidden="true">✓</span> Mitra NUSA-DHIPA
          </span>
        </div>
      </div>

      <dl className="nd-seller-card__stats">
        <div>
          <dt>Produk</dt>
          <dd>{seller.productCount}</dd>
        </div>
        <div>
          <dt>Kategori</dt>
          <dd>{seller.categories.size}</dd>
        </div>
      </dl>

      {categoriesList.length > 0 ? (
        <div className="nd-seller-card__tags">
          {categoriesList.map((cat) => (
            <span key={cat} className="nd-seller-tag">
              {cat}
            </span>
          ))}
          {seller.categories.size > 3 ? (
            <span className="nd-seller-tag nd-seller-tag--more">
              +{seller.categories.size - 3}
            </span>
          ) : null}
        </div>
      ) : null}

      <Link href={href} className="nd-seller-card__cta">
        Lihat Toko <span aria-hidden="true">→</span>
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
      <span aria-hidden="true">🏪</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

/* ---------- Page ---------- */

export default async function UmkmPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  let products: Product[] = [];
  let productsError = false;
  let business: BusinessInfo | null = null;

  // Fetch business info + products paralel
  const [businessResult, productsResult] = await Promise.allSettled([
    getBusinessInfo(),
    getProducts({
      q: query || undefined,
      limit: 100,
    }),
  ]);

  if (businessResult.status === "fulfilled") {
    business = businessResult.value;
  }

  if (productsResult.status === "fulfilled") {
    products = extractApiList<Product>(productsResult.value);
  } else {
    productsError = true;
  }

  // Build sellers + pass logo URL (kalau 1 bisnis)
  const sellers = buildSellers(products).map((s) => ({
    ...s,
    logoUrl: business?.logo_url
      ? resolveImageUrl(business.logo_url)
      : undefined,
  }));
  const totalSellers = sellers.length;
  const totalProducts = products.length;

  const categoryCount = new Map<string, number>();
  for (const p of products) {
    if (!p.category_name) continue;
    categoryCount.set(
      p.category_name,
      (categoryCount.get(p.category_name) ?? 0) + 1,
    );
  }
  const topCategories = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <main className="nd-marketplace">
      <div className="nd-content">
        {/* ================= BREADCRUMB ================= */}
        <Reveal>
          <nav
            className="nd-breadcrumb"
            aria-label="Navigasi halaman"
            style={{ marginBottom: 16 }}
          >
            <Link href="/">Beranda</Link>
            <span aria-hidden="true">›</span>
            <span>Mitra UMKM</span>
          </nav>
        </Reveal>

        {/* ================= HERO ================= */}
        <Reveal>
          <section
            className="nd-umkm-hero"
            aria-labelledby="nd-umkm-title"
          >
            <div className="nd-umkm-hero__content">
              <span className="nd-pill">EKOSISTEM UMKM NUSANTARA</span>

              <h1 id="nd-umkm-title">
                Kenali mitra usaha
                <br />
                NUSA-DHIPA.
              </h1>

              <p>
                Jelajahi pelaku usaha lokal yang mempercayakan
                produknya di marketplace NUSA-DHIPA. Temukan mitra
                yang tepat untuk kebutuhan bisnismu.
              </p>

              <div className="nd-umkm-hero__actions">
                <Link
                  href="/search"
                  className="nd-umkm-btn nd-umkm-btn--primary"
                >
                  Cari Produk <span aria-hidden="true">→</span>
                </Link>
                <a
                  href="#daftar-mitra"
                  className="nd-umkm-btn nd-umkm-btn--ghost"
                >
                  Lihat Daftar Mitra
                </a>
              </div>
            </div>

            <div className="nd-umkm-hero__art" aria-hidden="true">
              <span>🤝</span>
            </div>
          </section>
        </Reveal>

        {/* ================= STATS ================= */}
        {!productsError ? (
          <Reveal delay={60}>
            <section
              className="nd-umkm-stats"
              aria-label="Statistik mitra"
            >
              <div className="nd-umkm-stat">
                <span className="nd-umkm-stat__num">{totalSellers}</span>
                <strong>Mitra Usaha</strong>
                <small>Terdaftar di katalog</small>
              </div>
              <div className="nd-umkm-stat">
                <span className="nd-umkm-stat__num">{totalProducts}</span>
                <strong>Produk</strong>
                <small>Dari mitra terdaftar</small>
              </div>
              <div className="nd-umkm-stat">
                <span className="nd-umkm-stat__num">
                  {topCategories.length}
                </span>
                <strong>Kategori Aktif</strong>
                <small>Produk mitra</small>
              </div>
              <div className="nd-umkm-stat">
                <span className="nd-umkm-stat__num">34</span>
                <strong>Provinsi</strong>
                <small>Jangkauan nasional</small>
              </div>
            </section>
          </Reveal>
        ) : null}

        {/* ================= TOP CATEGORIES ================= */}
        {topCategories.length > 0 ? (
          <Reveal delay={90}>
            <section
              className="nd-umkm-cats"
              aria-labelledby="nd-umkm-cats-title"
            >
              <div className="nd-section-heading">
                <div>
                  <span className="nd-eyebrow">KATEGORI POPULER</span>
                  <h2 id="nd-umkm-cats-title">
                    Kategori mitra paling aktif
                  </h2>
                </div>
              </div>

              <div className="nd-umkm-cats__chips">
                {topCategories.map(([name, count]) => (
                  <Link
                    key={name}
                    href={`/search?category=${encodeURIComponent(name)}`}
                    className="nd-chip"
                  >
                    {name}
                    <span className="nd-chip__count">{count}</span>
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        ) : null}

        {/* ================= SELLER GRID ================= */}
        <Reveal delay={120}>
          <section
            id="daftar-mitra"
            className="nd-umkm-section"
            aria-labelledby="nd-umkm-list-title"
          >
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">DIREKTORI MITRA</span>
                <h2 id="nd-umkm-list-title">
                  {query ? `Mitra untuk "${query}"` : "Semua Mitra Usaha"}
                </h2>
                <p>
                  {totalSellers > 0
                    ? `Menampilkan ${totalSellers} mitra usaha dari katalog.`
                    : "Mitra akan muncul setelah tersedia di katalog."}
                </p>
              </div>

              <Link href="/search" className="nd-section-link">
                Jelajahi katalog <span aria-hidden="true">→</span>
              </Link>
            </div>

            {productsError ? (
              <EmptyState
                title="Direktori mitra sementara tidak tersedia"
                description="Layanan katalog belum dapat dihubungi. Silakan coba lagi beberapa saat."
              />
            ) : sellers.length === 0 ? (
              <EmptyState
                title={
                  query
                    ? `Tidak ada mitra untuk "${query}"`
                    : "Belum ada mitra terdaftar"
                }
                description={
                  query
                    ? "Coba kata kunci lain atau jelajahi seluruh katalog."
                    : "Mitra usaha akan ditampilkan setelah tersedia di katalog marketplace."
                }
              />
            ) : (
              <div className="nd-seller-grid">
                {sellers.map((seller) => (
                  <SellerCard key={seller.name} seller={seller} />
                ))}
              </div>
            )}
          </section>
        </Reveal>

        {/* ================= CTA JOIN ================= */}
        <Reveal>
          <section
            className="nd-umkm-cta"
            aria-labelledby="nd-umkm-cta-title"
          >
            <div className="nd-umkm-cta__symbol" aria-hidden="true">
              🤝
            </div>

            <div>
              <span className="nd-eyebrow">
                GABUNG EKOSISTEM NUSA-DHIPA
              </span>
              <h2 id="nd-umkm-cta-title">
                Ingin produkmu dikenal lebih luas?
              </h2>
              <p>
                Daftarkan usahamu sebagai mitra NUSA-DHIPA dan jangkau
                lebih banyak pelanggan serta pelaku bisnis di seluruh
                Indonesia.
              </p>
            </div>

            <Link href="/daftar" className="nd-umkm-cta__btn">
              Daftar Jadi Mitra <span aria-hidden="true">→</span>
            </Link>
          </section>
        </Reveal>

        {/* ================= NOTE ================= */}
        <Reveal>
          <div className="nd-marketplace-note">
            Informasi mitra usaha diperbarui langsung dari katalog
            NUSA-DHIPA. Hubungi mitra untuk detail kerja sama.
          </div>
        </Reveal>
      </div>
    </main>
  );
}