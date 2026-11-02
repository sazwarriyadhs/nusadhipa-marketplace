import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import { getProducts, getBusinesses, type Product, type BusinessInfo } from "@/lib/marketplace-api";

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

// --- Fallback Banner berdasarkan KBLI ---
function getFallbackBanner(kbliCode?: string | null, businessType?: string | null) {
  if (kbliCode?.startsWith("10") || kbliCode?.startsWith("56")) return "/kategori/01-makanan-minuman.png";
  if (kbliCode?.startsWith("01") || kbliCode?.startsWith("02")) return "/kategori/02-pertanian-hasil-bumi.png";
  if (kbliCode?.startsWith("62") || kbliCode?.startsWith("63")) return "/kategori/11-jasa-layanan-bisnis.png";
  if (businessType === "supplier") return "/kategori/12-industri-grosir-b2b.png";
  return "/kategori/03-peternakan-daging-perikanan.png"; // Default fallback
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
  bannerUrl?: string;
  kbliCode?: string;
  businessType?: string;
};

/* ---------- Components ---------- */

function SellerCard({ seller }: { seller: SellerInfo }) {
  const href = seller.slug ? `/umkm/${encodeURIComponent(seller.slug)}` : "/umkm";
  const categoriesList = Array.from(seller.categories).slice(0, 3);
  const coverImage = seller.bannerUrl || getFallbackBanner(seller.kbliCode, seller.businessType);

  return (
    <article 
      style={{ 
        position: "relative", 
        backgroundColor: "#fff", 
        borderRadius: "16px", 
        border: "1px solid #e5e7eb",
        overflow: "visible", // Penting agar logo tidak terpotong
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
      }}
    >
      {/* --- 1. BANNER IMAGE --- */}
      <div style={{ position: "relative", width: "100%", height: "140px", backgroundColor: "#f3f4f6", borderRadius: "16px 16px 0 0", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={`Cover ${seller.name}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" }} />
      </div>

      {/* --- 2. LOGO TOKO (Absolute, agar menumpuk di batas banner) --- */}
      <div 
        style={{ 
          position: "absolute", 
          top: "100px", // Setengah dari tinggi banner
          left: "20px", 
          width: "72px", 
          height: "72px", 
          backgroundColor: "#fff", 
          borderRadius: "14px", 
          padding: "4px", 
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)", 
          zIndex: 50, 
          border: "1px solid #e5e7eb"
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={seller.logoUrl || "/images/placeholder-logo.png"} 
          alt={seller.name} 
          style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px" }} 
        />
      </div>

      {/* --- 3. KONTEN KARTU --- */}
      <div 
        style={{ 
          padding: "48px 20px 20px", // Padding atas ekstra memberi ruang logo
          display: "flex", 
          flexDirection: "column", 
          flex: 1,
          backgroundColor: "#fff",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: 6, color: "#111827", lineHeight: 1.2 }}>
            {seller.name}
          </h3>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "12px", fontWeight: 600, color: "#059669", backgroundColor: "#ecfdf5", padding: "4px 8px", borderRadius: "6px" }}>
            <span aria-hidden="true">✓</span> Mitra NUSA-DHIPA
          </span>
        </div>

        <div style={{ display: "flex", gap: "24px", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", padding: "12px 0", marginBottom: "16px" }}>
          <div>
            <span style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Produk</span>
            <strong style={{ display: "block", fontSize: "22px", color: "#b91c2c" }}>{seller.productCount}</strong>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Kategori</span>
            <strong style={{ display: "block", fontSize: "22px", color: "#b91c2c" }}>{seller.categories.size}</strong>
          </div>
        </div>

        {/* Tags Kategori */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          {categoriesList.map((cat) => (
            <span key={cat} style={{ fontSize: "12px", color: "#374151", backgroundColor: "#f3f4f6", padding: "4px 10px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
              {cat}
            </span>
          ))}
          {seller.categories.size > 3 && (
            <span style={{ fontSize: "12px", color: "#6b7280", backgroundColor: "#f9fafb", padding: "4px 10px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
              +{seller.categories.size - 3}
            </span>
          )}
        </div>

        {/* Tombol Aksi */}
        <Link 
          href={href} 
          style={{ 
            marginTop: "auto", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "8px",
            backgroundColor: "#b91c2c", 
            color: "#fff", 
            padding: "12px 20px", 
            borderRadius: "8px", 
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "background-color 0.2s"
          }}
        >
          Lihat Toko <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#fff", borderRadius: "16px", border: "1px dashed #d1d5db" }} role="status">
      <span style={{ fontSize: "3rem", display: "block", marginBottom: "16px" }} aria-hidden="true">🏪</span>
      <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>{title}</h3>
      <p style={{ color: "#6b7280", maxWidth: "400px", margin: "0 auto" }}>{description}</p>
    </div>
  );
}

/* ---------- Page ---------- */

export default async function UmkmPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  let products: Product[] = [];
  let productsError = false;
  let businesses: BusinessInfo[] = [];

  const [businessesResult, productsResult] = await Promise.allSettled([
    getBusinesses(),
    getProducts({ q: query || undefined, limit: 100 }),
  ]);

  if (businessesResult.status === "fulfilled") {
    businesses = businessesResult.value;
  }

  if (productsResult.status === "fulfilled") {
    products = extractApiList<Product>(productsResult.value);
  } else {
    productsError = true;
  }

  // Build sellers + pass logo URL & banner URL
  const sellers = businesses
    .map((biz) => {
      const bizProducts = products.filter((p) => p.business_slug === biz.slug);
      const categories = new Set<string>();
      bizProducts.forEach((p) => {
        if (p.category_name) categories.add(p.category_name);
      });

      return {
        name: biz.business_name,
        slug: biz.slug,
        productCount: bizProducts.length,
        categories,
        logoUrl: biz.logo_url ? resolveImageUrl(biz.logo_url) : undefined,
        bannerUrl: biz.banner_url ? resolveImageUrl(biz.banner_url) : undefined,
        kbliCode: biz.kbli_code ?? undefined,
        businessType: biz.business_type ?? undefined,
      };
    })
    .sort((a, b) => b.productCount - a.productCount);

  const totalSellers = sellers.length;
  const totalProducts = products.length;

  const categoryCount = new Map<string, number>();
  for (const p of products) {
    if (!p.category_name) continue;
    categoryCount.set(p.category_name, (categoryCount.get(p.category_name) ?? 0) + 1);
  }
  const topCategories = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <main className="nd-marketplace" style={{ backgroundColor: "#f9fafb", minHeight: "100vh", paddingBottom: "60px" }}>
      <div className="nd-content" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        
        {/* --- BREADCRUMB --- */}
        <Reveal>
          <nav style={{ marginBottom: "16px", fontSize: "14px", color: "#6b7280", display: "flex", gap: "8px", paddingTop: "20px" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Beranda</Link>
            <span aria-hidden="true">›</span>
            <span style={{ color: "#111827", fontWeight: 500 }}>Mitra UMKM</span>
          </nav>
        </Reveal>

        {/* --- HERO SECTION --- */}
        <Reveal>
          <section style={{ backgroundColor: "#fff", borderRadius: "24px", padding: "40px", marginBottom: "24px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", border: "1px solid #e5e7eb" }}>
            <div style={{ flex: "1 1 500px" }}>
              <span style={{ display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#b91c2c", backgroundColor: "#fef2f2", padding: "6px 12px", borderRadius: "99px", marginBottom: "16px", letterSpacing: "1px" }}>EKOSISTEM UMKM NUSANTARA</span>
              <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, color: "#111827", lineHeight: 1.1, marginBottom: "16px" }}>
                Kenali mitra usaha<br />NUSA-DHIPA.
              </h1>
              <p style={{ fontSize: "16px", color: "#4b5563", maxWidth: "500px", lineHeight: 1.6, marginBottom: "24px" }}>
                Jelajahi pelaku usaha lokal yang mempercayakan produknya di marketplace NUSA-DHIPA. Temukan mitra yang tepat untuk kebutuhan bisnismu.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/search" style={{ backgroundColor: "#b91c2c", color: "#fff", padding: "12px 24px", borderRadius: "8px", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  Cari Produk <span aria-hidden="true">→</span>
                </Link>
                <a href="#daftar-mitra" style={{ backgroundColor: "#fff", color: "#374151", padding: "12px 24px", borderRadius: "8px", fontWeight: 600, textDecoration: "none", border: "1px solid #d1d5db" }}>
                  Lihat Daftar Mitra
                </a>
              </div>
            </div>
            <div style={{ fontSize: "100px", lineHeight: 1 }} aria-hidden="true">🤝</div>
          </section>
        </Reveal>

        {/* --- STATS SECTION --- */}
        {!productsError && (
          <Reveal delay={60}>
            <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              {[
                { num: totalSellers, label: "Mitra Usaha", sub: "Terdaftar di katalog" },
                { num: totalProducts, label: "Produk", sub: "Dari mitra terdaftar" },
                { num: topCategories.length, label: "Kategori Aktif", sub: "Produk mitra" },
                { num: 34, label: "Provinsi", sub: "Jangkauan nasional" }
              ].map((stat, i) => (
                <div key={i} style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
                  <span style={{ display: "block", fontSize: "32px", fontWeight: 800, color: "#b91c2c", lineHeight: 1 }}>{stat.num}</span>
                  <strong style={{ display: "block", fontSize: "15px", color: "#111827", marginTop: "8px" }}>{stat.label}</strong>
                  <small style={{ display: "block", fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{stat.sub}</small>
                </div>
              ))}
            </section>
          </Reveal>
        )}

        {/* --- TOP CATEGORIES --- */}
        {topCategories.length > 0 && (
          <Reveal delay={90}>
            <section style={{ marginBottom: "40px" }}>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#6b7280", letterSpacing: "1px", marginBottom: "4px" }}>KATEGORI POPULER</span>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#111827" }}>Kategori mitra paling aktif</h2>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {topCategories.map(([name, count]) => (
                  <Link key={name} href={`/search?category=${encodeURIComponent(name)}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#fff", padding: "8px 16px", borderRadius: "99px", border: "1px solid #d1d5db", textDecoration: "none", color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                    {name} <span style={{ backgroundColor: "#fef2f2", color: "#b91c2c", padding: "2px 8px", borderRadius: "99px", fontSize: "12px", fontWeight: 700 }}>{count}</span>
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* --- SELLER GRID --- */}
        <Reveal delay={120}>
          <section id="daftar-mitra" style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
              <div>
                <span style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#6b7280", letterSpacing: "1px", marginBottom: "4px" }}>DIREKTORI MITRA</span>
                <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>{query ? `Mitra untuk "${query}"` : "Semua Mitra Usaha"}</h2>
                <p style={{ color: "#6b7280", fontSize: "15px" }}>{totalSellers > 0 ? `Menampilkan ${totalSellers} mitra usaha dari katalog.` : "Mitra akan muncul setelah tersedia di katalog."}</p>
              </div>
              <Link href="/search" style={{ color: "#b91c2c", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                Jelajahi katalog <span aria-hidden="true">→</span>
              </Link>
            </div>

            {productsError ? (
              <EmptyState title="Direktori mitra sementara tidak tersedia" description="Layanan katalog belum dapat dihubungi. Silakan coba lagi beberapa saat." />
            ) : sellers.length === 0 ? (
              <EmptyState title={query ? `Tidak ada mitra untuk "${query}"` : "Belum ada mitra terdaftar"} description={query ? "Coba kata kunci lain atau jelajahi seluruh katalog." : "Mitra usaha akan ditampilkan setelah tersedia di katalog marketplace."} />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {sellers.map((seller) => (
                  <SellerCard key={seller.name} seller={seller} />
                ))}
              </div>
            )}
          </section>
        </Reveal>

        {/* --- CTA JOIN --- */}
        <Reveal>
          <section style={{ backgroundColor: "#111827", borderRadius: "24px", padding: "48px 40px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "32px", marginBottom: "32px" }}>
            <div style={{ flex: "1 1 500px", color: "#fff" }}>
              <span style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#f87171", letterSpacing: "1px", marginBottom: "8px" }}>GABUNG EKOSISTEM NUSA-DHIPA</span>
              <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "12px" }}>Ingin produkmu dikenal lebih luas?</h2>
              <p style={{ color: "#9ca3af", lineHeight: 1.6, maxWidth: "600px" }}>Daftarkan usahamu sebagai mitra NUSA-DHIPA dan jangkau lebih banyak pelanggan serta pelaku bisnis di seluruh Indonesia.</p>
            </div>
            <Link href="/daftar" style={{ backgroundColor: "#b91c2c", color: "#fff", padding: "14px 28px", borderRadius: "8px", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
              Daftar Jadi Mitra <span aria-hidden="true">→</span>
            </Link>
          </section>
        </Reveal>

        {/* --- NOTE --- */}
        <Reveal>
          <div style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", padding: "20px 0", borderTop: "1px solid #e5e7eb" }}>
            Informasi mitra usaha diperbarui langsung dari katalog NUSA-DHIPA. Hubungi mitra untuk detail kerja sama.
          </div>
        </Reveal>
      </div>
    </main>
  );
}