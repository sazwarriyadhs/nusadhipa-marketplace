
import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import CartCount from "@/components/cart/CartCount";

const SITE_URL = "https://nusadhipa.shop";
const SITE_NAME = "NUSA-DHIPA Marketplace";
const SITE_DESCRIPTION =
  "Jelajahi produk dan bisnis UMKM seluruh Indonesia melalui NUSA-DHIPA Marketplace. Temukan produk, pemasok B2B, peluang bisnis, dan informasi kegiatan usaha berdasarkan KBLI 2025.";

const LOGO_PATH = "/images/logo_nusadhipa.png";
const SOCIAL_IMAGE_PATH = "/images/header_image.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | UMKM Indonesia`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "shopping",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "id_ID",
    title: `${SITE_NAME} | UMKM Indonesia`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SOCIAL_IMAGE_PATH,
        alt: "NUSA-DHIPA Marketplace — Ekosistem UMKM Indonesia",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | UMKM Indonesia`,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE_PATH],
  },
  icons: {
    icon: LOGO_PATH,
    shortcut: LOGO_PATH,
    apple: LOGO_PATH,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#b91c2c",
};

type NavigationItem = {
  href: string;
  label: string;
};

const MAIN_NAVIGATION: NavigationItem[] = [
  { href: "/", label: "Beranda" },
  { href: "/search", label: "Produk" },
  { href: "/umkm", label: "UMKM & Bisnis" },
  { href: "/peluang-usaha", label: "Peluang Bisnis" },
  { href: "/b2b", label: "B2B" },
  { href: "/kbli-2025", label: "KBLI 2025" },
  { href: "/promo", label: "Promo" },
  { href: "/bantuan", label: "Bantuan" },
];

const FOOTER_GROUPS = [
  {
    title: "Tautan cepat",
    links: [
      { href: "/", label: "Beranda" },
      { href: "/search", label: "Produk" },
      { href: "/umkm", label: "Toko & UMKM" },
    ],
  },
  {
    title: "Jelajahi",
    links: [
      { href: "/promo", label: "Promo" },
      { href: "/b2b", label: "Layanan B2B" },
      { href: "/peluang-usaha", label: "Peluang bisnis" },
      { href: "/kbli-2025", label: "KBLI 2025" },
      { href: "/bantuan", label: "Bantuan" },
    ],
  },
  {
    title: "Untuk mitra",
    links: [
      { href: "/umkm", label: "Gabung sebagai mitra" },
      { href: "/b2b", label: "Kerja sama B2B" },
    ],
  },
];

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      href="/"
      className={footer ? "footer-brand" : "brand"}
      aria-label="NUSA-DHIPA Marketplace — Beranda"
    >
      <Image
        src={LOGO_PATH}
        alt="NUSA-DHIPA Marketplace"
        width={220}
        height={72}
        priority={!footer}
        sizes={
          footer
            ? "180px"
            : "(max-width: 640px) 145px, 200px"
        }
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          maxWidth: footer ? 180 : 220,
          objectFit: "contain",
        }}
      />
    </Link>
  );
}

function MainHeader() {
  return (
    <>
      <div className="nd-top-strip">
        <span>Ekosistem usaha lokal Indonesia</span>
        <span>Belanja mudah · Mitra usaha · Peluang lebih luas</span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <BrandLogo />

          <form
            action="/search"
            method="get"
            className="nd-header-search"
            role="search"
          >
            <label className="nd-sr-only" htmlFor="site-search">
              Cari produk, kategori, atau toko
            </label>
            <input
              id="site-search"
              type="search"
              name="q"
              placeholder="Cari produk, kategori, atau toko..."
            />
            <button type="submit" aria-label="Cari">
              Cari
            </button>
          </form>

          <div className="nd-header-actions">
            <span className="nd-location">Indonesia</span>
            <Link href="/login" className="nd-account">
              Masuk / Daftar
            </Link>
            <Link
              href="/keranjang"
              className="nd-cart"
              aria-label="Keranjang belanja"
            >
              <CartCount />
            </Link>
          </div>
        </div>

        <nav className="main-nav" aria-label="Navigasi utama">
          {MAIN_NAVIGATION.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand-section">
          <BrandLogo footer />
          <p>
            Merajut kualitas lokal Nusantara melalui marketplace
            produk, layanan, dan bisnis yang saling terhubung.
          </p>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <nav
            className="footer-links"
            aria-label={group.title}
            key={group.title}
          >
            <strong>{group.title}</strong>
            {group.links.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        ))}

        <div className="footer-bottom">
          <small>
            © {new Date().getFullYear()} NUSA-DHIPA. Hak cipta
            dilindungi.
          </small>
          <small>Marketplace UMKM Indonesia</small>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AppProviders>
          <a className="skip-link" href="#main-content">
            Lewati ke konten utama
          </a>

          <MainHeader />

          <div id="main-content" tabIndex={-1}>
            {children}
          </div>

          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
