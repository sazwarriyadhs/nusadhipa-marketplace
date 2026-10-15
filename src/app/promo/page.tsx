import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import { PromoContent } from "@/components/PromoContent";
import {
  getProducts,
  formatRupiah,
  type Product,
} from "@/lib/marketplace-api";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

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
        </div>
      </Link>

      <Link href={href} className="nd-product-card__button">
        Lihat Produk <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

const promoHighlights = [
  {
    icon: "🎁",
    title: "Bundling Hemat",
    description:
      "Paket produk dengan harga spesial untuk pembelian dalam jumlah tertentu.",
    accent: "red" as const,
  },
  {
    icon: "🚚",
    title: "Gratis Ongkir",
    description:
      "Bebas biaya kirim untuk wilayah tertentu dengan minimum pembelian.",
    accent: "green" as const,
  },
  {
    icon: "🏷️",
    title: "Diskon Grosir",
    description:
      "Harga khusus untuk pembelian grosir atau langganan rutin.",
    accent: "amber" as const,
  },
  {
    icon: "🎯",
    title: "Cashback",
    description:
      "Dapatkan cashback dari mitra tertentu untuk transaksi berulang.",
    accent: "red" as const,
  },
];

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
export default async function PromoPage({ searchParams }: PageProps) {
  await searchParams;

  let products: Product[] = [];
  let productsError = false;

  try {
    const raw = await getProducts({ limit: 100 });
    products = extractApiList<Product>(raw);
  } catch {
    productsError = true;
  }

  return (
    <main className="nd-marketplace">
      <div className="nd-content">
        <Reveal>
          <nav
            className="nd-breadcrumb"
            aria-label="Navigasi halaman"
            style={{ marginBottom: 16 }}
          >
            <Link href="/">Beranda</Link>
            <span aria-hidden="true">›</span>
            <span>Promo</span>
          </nav>
        </Reveal>

        <Reveal>
          <section className="nd-opp-hero" aria-labelledby="nd-promo-title">
            <div className="nd-opp-hero__content">
              <span className="nd-pill">PROMO & PENAWARAN</span>

              <h1 id="nd-promo-title">
                Belanja lebih hemat,
                <br />
                bisnis lebih untung.
              </h1>

              <p>
                Temukan penawaran terbaru dari mitra usaha
                NUSA-DHIPA: bundling, diskon grosir, cashback, dan
                gratis ongkir untuk wilayah tertentu.
              </p>

              <div className="nd-opp-hero__actions">
                <Link
                  href="/search"
                  className="nd-opp-btn nd-opp-btn--primary"
                >
                  Jelajahi Produk <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/umkm"
                  className="nd-opp-btn nd-opp-btn--ghost"
                >
                  Lihat Mitra
                </Link>
              </div>

              <ul className="nd-opp-hero__points">
                <li>
                  <span aria-hidden="true">✓</span> Diskon grosir
                </li>
                <li>
                  <span aria-hidden="true">✓</span> Bundling hemat
                </li>
                <li>
                  <span aria-hidden="true">✓</span> Cashback mitra
                </li>
              </ul>
            </div>

            <div className="nd-opp-hero__art" aria-hidden="true">
              <div className="nd-opp-hero__art-card">
                <span>🎁</span>
                <strong>Promo Spesial</strong>
                <small>Berlaku terbatas</small>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ===== COUNTER + FILTER + CARD PROMO ===== */}
        <Reveal delay={40}>
          <PromoContent products={products} />
        </Reveal>

        <Reveal delay={60}>
          <section
            className="nd-opp-section"
            aria-labelledby="nd-promo-types-title"
          >
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">JENIS PROMO</span>
                <h2 id="nd-promo-types-title">
                  Beragam penawaran untukmu
                </h2>
                <p>
                  Setiap promo punya skema berbeda. Baca detail di
                  halaman produk mitra terkait.
                </p>
              </div>
            </div>

            <div className="nd-opp-grid">
              {promoHighlights.map((item) => (
                <div
                  key={item.title}
                  className={`nd-opp-card nd-opp-card--${item.accent}`}
                >
                  <span
                    className="nd-opp-card__icon"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={90}>
          <section
            className="nd-opp-section"
            aria-labelledby="nd-promo-products-title"
          >
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">PRODUK PROMO</span>
                <h2 id="nd-promo-products-title">
                  Sedang banyak dicari
                </h2>
                <p>
                  Produk pilihan dari mitra yang sedang aktif
                  menawarkan harga spesial.
                </p>
              </div>

              <Link href="/search" className="nd-section-link">
                Lihat semua <span aria-hidden="true">→</span>
              </Link>
            </div>

            {productsError ? (
              <div className="nd-empty-state" role="status">
                <span aria-hidden="true">🔎</span>
                <h3>Promo sementara tidak tersedia</h3>
                <p>
                  Layanan katalog belum dapat dihubungi. Silakan
                  coba lagi beberapa saat.
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="nd-empty-state" role="status">
                <span aria-hidden="true">🎁</span>
                <h3>Belum ada promo aktif</h3>
                <p>
                  Promo akan tampil setelah mitra menambahkan
                  penawaran baru.
                </p>
              </div>
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

        <Reveal>
          <section
            className="nd-opp-cta"
            aria-labelledby="nd-promo-cta-title"
          >
            <div className="nd-opp-cta__symbol" aria-hidden="true">
              🎁
            </div>

            <div>
              <span className="nd-eyebrow">JANGAN LEWATKAN</span>
              <h2 id="nd-promo-cta-title">
                Daftar mitra, dapat promo eksklusif
              </h2>
              <p>
                Gabung sebagai mitra NUSA-DHIPA dan nikmati akses
                promo khusus serta penawaran B2B dari mitra
                terverifikasi.
              </p>
            </div>

            <div className="nd-opp-cta__actions">
              <Link href="/daftar" className="nd-opp-cta__btn">
                Daftar Mitra <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/bantuan"
                className="nd-opp-cta__btn nd-opp-cta__btn--ghost"
              >
                Bantuan
              </Link>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <div className="nd-marketplace-note">
            Promo mengikuti ketersediaan dari mitra usaha. Syarat
            dan ketentuan berlaku sesuai kebijakan masing-masing
            mitra.
          </div>
        </Reveal>
      </div>
    </main>
  );
}