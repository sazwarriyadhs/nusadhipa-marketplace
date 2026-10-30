import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import {
  getBusinessBySlug,
  getProducts,
  formatRupiah,
  type Product,
  type BusinessInfo,
} from "@/lib/marketplace-api";
import { formatStock } from "@/lib/format-stock";
import { getSauriImage, getCategoryImage } from "@/lib/sauri-images";
import { StoreCatalog } from "@/components/store/StoreCatalog";
import { FollowButton } from "@/components/store/FollowButton";
import "./store-profile.css";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
  process.env.MARKETPLACE_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:4000/api/v1"
    : "https://api.nusadhipa.shop/api/v1")
).replace(/\/api\/v1\/?$/, "");

function toWhatsAppNumber(phone: string | null | undefined): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

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

/* ---------- Icons ---------- */
function IconPin(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconPhone(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
function IconMail(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}
function IconCheck(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}
function IconShield(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 2 3 7v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V7l-9-5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function IconWhatsApp(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z" />
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Z" />
    </svg>
  );
}
function IconStarFilled(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2Z" />
    </svg>
  );
}
function IconBox(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m7.5 4.3 9 5.2" />
      <path d="M3.3 7 12 12l8.7-5" />
      <path d="M12 22V12" />
      <path d="m3.3 17 8.7 5 8.7-5V7L12 2 3.3 7v10Z" />
    </svg>
  );
}
function IconTag(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7" cy="7" r="1.2" />
    </svg>
  );
}
function IconTruck(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10 17h4V5H2v12h3" />
      <path d="M14 17h1l4-4h1V9h-6" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
function IconGlobe(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}

function ProductCard({ product }: { product: Product }) {
  const originalImageUrl = resolveImageUrl(product.image_url);
  const fallbackByProduct = getSauriImage(product.name);
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
    <Link href={href} className="nd-product">
      <div className="nd-product__img">
        {product.category_name && (
          <span className="nd-product__cat">{product.category_name}</span>
        )}
        <div className="nd-product__quick">
          <button type="button" aria-label="Wishlist" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z" />
            </svg>
          </button>
        </div>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            onError={(event) => {
              const img = event.currentTarget;
              const fallback = fallbackByProduct || fallbackByCategory;

              if (fallback && img.src !== new URL(fallback, window.location.href).href) {
                img.onerror = null;
                img.src = fallback;
              } else {
                img.style.display = "none";
                const empty = img.parentElement?.querySelector(".nd-product__empty");
                if (empty) (empty as HTMLElement).style.display = "grid";
              }
            }}
          />
        ) : null}
        <div
          className="nd-product__empty"
          style={{ display: imageUrl ? "none" : "grid" }}
        >
          <span aria-hidden="true">🛍️</span>
          <small>Foto belum tersedia</small>
        </div>
      </div>
      <div className="nd-product__body">
        <h3 className="nd-product__name">{product.name}</h3>
        <div className="nd-product__rating">
          <IconStarFilled />
          <b>Baru</b>
          {product.available_stock != null && (
            <span>· Stok {formatStock(product.available_stock, product.selling_unit, product.sales_mode)}</span>
          )}
        </div>
        <div className="nd-product__price">{price}</div>
        <span className="nd-product__btn">Lihat Produk</span>
      </div>
    </Link>
  );
}

export default async function StoreProfilePage({ params }: PageProps) {
  const { slug } = await params;

  const businessResult = await getBusinessBySlug(slug).catch(() => null);

  if (!businessResult || businessResult.slug !== slug) {
    return (
      <main className="nd-store-profile">
        <div className="nd-content">
          <div className="nd-empty-page">
            <span style={{ fontSize: "3rem" }}>🏪</span>
            <h1>Toko tidak ditemukan</h1>
            <p>Toko dengan alamat ini belum terdaftar.</p>
            <Link href="/umkm" className="nd-btn nd-btn--primary">
              Kembali ke Direktori Mitra
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const productsResult = await getProducts({ businessSlug: slug, limit: 100 }).catch(() => []);

  const business: BusinessInfo | null = businessResult;
  const products: Product[] = extractApiList<Product>(productsResult);

  const categories = Array.from(
    new Set(products.map((p) => p.category_name).filter(Boolean)),
  ).slice(0, 6);

  const businessName = business?.business_name ?? "Toko";
  const kbliCode = business?.kbli_code ?? "";
  const kbliName = (business?.kbli_name ?? "").toLowerCase();
  const businessNameLower = businessName.toLowerCase();

  let bannerUrl = "/kategori/03-peternakan-daging-perikanan.png"; 

  if (kbliCode === "46322" || kbliCode === "46325") {
    bannerUrl = "/kategori/03-peternakan-daging-perikanan.png";
  } else if (kbliCode === "47761") {
    bannerUrl = "/kategori/09-tanaman-bunga-florist.png";
  } else if (kbliCode === "62900" || kbliCode === "62010" || kbliCode === "62020") {
    bannerUrl = "/kategori/11-jasa-layanan-bisnis.png";
  } else if (kbliCode.startsWith("01") || kbliCode.startsWith("02") || kbliCode.startsWith("03") || kbliName.includes("pertanian")) {
    bannerUrl = "/kategori/02-pertanian-hasil-bumi.png";
  } else if (
    kbliCode.startsWith("10") || kbliCode.startsWith("11") || kbliCode.startsWith("12") || kbliCode.startsWith("56") || 
    kbliName.includes("makanan") || kbliName.includes("minuman") || 
    businessNameLower.includes("pempek") || businessNameLower.includes("kue") || businessNameLower.includes("katering")
  ) {
    bannerUrl = "/kategori/01-makanan-minuman.png";
  } else if (kbliCode.startsWith("46205") || kbliName.includes("petfood") || kbliName.includes("makanan hewan")) {
    bannerUrl = "/kategori/04-petfood-kebutuhan-hewan.png";
  } else if (kbliCode.startsWith("14") || kbliCode.startsWith("15") || kbliName.includes("fashion") || kbliName.includes("pakaian")) {
    bannerUrl = "/kategori/05-fashion-aksesori.png";
  } else if (kbliCode.startsWith("16") || kbliCode.startsWith("31") || kbliCode.startsWith("32") || kbliName.includes("kerajinan")) {
    bannerUrl = "/kategori/06-kerajinan-produk-kreatif.png";
  } else if (kbliCode.startsWith("96") || kbliName.includes("kecantikan") || kbliName.includes("kosmetik")) {
    bannerUrl = "/kategori/08-kecantikan-perawatan-diri.png";
  } else if (kbliName.includes("bunga") || kbliName.includes("florist") || kbliName.includes("tanaman hias")) {
    bannerUrl = "/kategori/09-tanaman-bunga-florist.png";
  } else if (kbliCode.startsWith("26") || kbliCode.startsWith("27") || kbliName.includes("elektronik")) {
    bannerUrl = "/kategori/10-elektronik-peralatan.png";
  } else if (kbliCode.startsWith("62") || kbliCode.startsWith("63") || kbliCode.startsWith("69") || kbliCode.startsWith("70") || kbliCode.startsWith("73") || kbliName.includes("jasa") || kbliName.includes("bisnis") || kbliName.includes("teknologi")) {
    bannerUrl = "/kategori/11-jasa-layanan-bisnis.png";
  } else if (kbliCode.startsWith("46") || kbliCode.startsWith("47") || kbliName.includes("grosir") || kbliName.includes("b2b")) {
    bannerUrl = "/kategori/12-industri-grosir-b2b.png";
  }

  const logoUrl = resolveImageUrl(business?.logo_url);
  const isVerified = business?.verification_status?.toLowerCase() === "verified";

  return (
    <main className="nd-store-profile">
      <div className="nd-content">
        <Reveal>
          <nav className="nd-breadcrumb" aria-label="Navigasi">
            <Link href="/">Beranda</Link>
            <span aria-hidden="true">/</span>
            <Link href="/umkm">Mitra Usaha</Link>
            <span aria-hidden="true">/</span>
            <span className="nd-breadcrumb__current">{businessName}</span>
          </nav>
        </Reveal>

        <Reveal>
          <section className="nd-hero">
            <div className="nd-hero__banner">
              <div
                className="nd-hero__bg"
                style={{ backgroundImage: `url(${bannerUrl})` }}
              />
              <div className="nd-hero__overlay" />

              {isVerified && (
                <div className="nd-hero__float">
                  <div className="nd-hero__float-ico">
                    <IconShield />
                  </div>
                  <div>
                    <b>Legalitas Lengkap</b>
                    <span>NIB · NPWP · KBLI 2025</span>
                  </div>
                </div>
              )}

              <div className="nd-hero__content">
                {isVerified && (
                  <span className="nd-hero__badge">
                    <IconStarFilled /> Mitra Resmi NUSA-DHIPA
                  </span>
                )}
                <h1 className="nd-hero__title">{businessName}</h1>
                {business?.legal_name && (
                  <p className="nd-hero__sub">{business.legal_name}</p>
                )}
                <div className="nd-hero__stats">
                  <div className="nd-hero__stat">
                    <b>{products.length}</b>
                    <span>Produk</span>
                  </div>
                  <div className="nd-hero__stat">
                    <b>{categories.length}</b>
                    <span>Kategori</span>
                  </div>
                  <div className="nd-hero__stat">
                    <b>{isVerified ? "100%" : "—"}</b>
                    <span>Terverifikasi</span>
                  </div>
                  <div className="nd-hero__stat">
                    <b>B2B</b>
                    <span>&amp; Eceran</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <section className="nd-profile-wrap">
          <div className="nd-profile">
            <div className="nd-profile__logo">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={businessName} />
              ) : (
                <div className="nd-profile__logo-fallback">
                  {businessName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="nd-profile__body">
              <h2 className="nd-profile__name">{businessName}</h2>

              <div className="nd-profile__meta">
                {business?.city && (
                  <span>
                    <IconPin /> {business.city}
                    {business.province ? `, ${business.province}` : ""}
                  </span>
                )}
                {business?.phone && (
                  <span>
                    <IconPhone /> {business.phone}
                  </span>
                )}
                {business?.email && (
                  <span>
                    <IconMail /> {business.email}
                  </span>
                )}
              </div>

              <div className="nd-badges" aria-label="Status legalitas usaha">
                {isVerified ? (
                  <>
                    <span className="nd-badge-legal">
                      <IconCheck /> NIB Terverifikasi
                    </span>
                    <span className="nd-badge-legal">
                      <IconCheck /> NPWP Terverifikasi
                    </span>
                    <span className="nd-badge-legal">
                      <IconCheck /> KBLI 2025 Terverifikasi
                    </span>
                  </>
                ) : (
                  <span className="nd-badge-legal nd-badge-legal--pending">
                    Status legalitas dalam peninjauan
                  </span>
                )}
              </div>

              <div className="nd-actions">
                {business?.phone && (
                  <a
                    href={`https://wa.me/${toWhatsAppNumber(business.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nd-btn nd-btn--primary"
                  >
                    <IconWhatsApp /> Chat WhatsApp
                  </a>
                )}
                {business?.phone && (
                  <a href={`tel:${business.phone}`} className="nd-btn nd-btn--outline-red">
                    <IconPhone /> Telepon
                  </a>
                )}
                <FollowButton />
              </div>

              {/* KAMI ADA DI */}
              {(business?.instagram_url || business?.tiktok_url || business?.facebook_url || business?.website_url) && (
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed #e5e7eb' }}>
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Kami Ada Di:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {business?.instagram_url && (
                      <a href={business.instagram_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', border: '1px solid #d1d5db', color: '#4b5563', backgroundColor: '#fff' }}>
                        <img src="https://res.cloudinary.com/wqytmco9/image/upload/v1793339974/instagram.png" alt="Instagram" width={18} height={18} />
                        Instagram
                      </a>
                    )}
                    {business?.tiktok_url && (
                      <a href={business.tiktok_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', border: '1px solid #d1d5db', color: '#4b5563', backgroundColor: '#fff' }}>
                        <img src="https://res.cloudinary.com/wqytmco9/image/upload/v1793339973/tiktok.png" alt="TikTok" width={18} height={18} />
                        TikTok
                      </a>
                    )}
                    {business?.facebook_url && (
                      <a href={business.facebook_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', border: '1px solid #d1d5db', color: '#4b5563', backgroundColor: '#fff' }}>
                        <img src="https://res.cloudinary.com/wqytmco9/image/upload/v1793339973/facebook.png" alt="Facebook" width={18} height={18} />
                        Facebook
                      </a>
                    )}
                    {business?.website_url && (
                      <a href={business.website_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', border: '1px solid #d1d5db', color: '#4b5563', backgroundColor: '#fff' }}>
                        <IconGlobe /> Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <Reveal delay={40}>
          <section className="nd-summary">
            <span className="nd-eyebrow">Ringkasan Toko</span>
            <h3 className="nd-summary__title">
              Performa &amp; Legalitas dalam Angka
            </h3>

            <div className="nd-summary__grid">
              <div className="nd-stat-card">
                <div className="nd-stat-card__icon">
                  <IconBox />
                </div>
                <div className="nd-stat-card__value">{products.length}</div>
                <div className="nd-stat-card__label">Jumlah Produk</div>
              </div>
              <div className="nd-stat-card">
                <div className="nd-stat-card__icon">
                  <IconTag />
                </div>
                <div className="nd-stat-card__value">{categories.length}</div>
                <div className="nd-stat-card__label">Kategori</div>
              </div>
              <div className="nd-stat-card nd-stat-card--accent">
                <div className="nd-stat-card__icon">
                  <IconShield />
                </div>
                <div className="nd-stat-card__value">
                  {isVerified ? "Terverifikasi" : "Menunggu"}
                </div>
                <div className="nd-stat-card__label">Legalitas Status</div>
              </div>
              <div className="nd-stat-card">
                <div className="nd-stat-card__icon">
                  <IconTruck />
                </div>
                <div className="nd-stat-card__value">Eceran / B2B</div>
                <div className="nd-stat-card__label">Pembelian</div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={60}>
          <StoreCatalog
            products={products}
            categories={categories}
            businessName={businessName}
          />
        </Reveal>
      </div>
    </main>
  );
}