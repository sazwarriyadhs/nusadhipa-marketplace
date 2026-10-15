import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import { getProducts, type Product } from "@/lib/marketplace-api";
import { B2BContent } from "@/components/B2BContent";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; kategori?: string }>;
};

const b2bServices = [
  {
    slug: "supplier",
    icon: "🏭",
    title: "Direktori Supplier",
    description:
      "Temukan pabrik, grosir, dan distributor terpercaya untuk kebutuhan bahan baku, kemasan, dan alat produksi.",
    tags: ["Grosir", "Pabrik", "Distributor"],
    href: "/search",
    accent: "red" as const,
  },
  {
    slug: "pengadaan",
    icon: "📋",
    title: "Pengadaan Barang",
    description:
      "Ajukan permintaan pengadaan dalam jumlah besar. Dapatkan penawaran dari banyak supplier sekaligus.",
    tags: ["Request quote", "Volume besar", "Kontrak"],
    href: "/search",
    accent: "green" as const,
  },
  {
    slug: "reseller",
    icon: "🤝",
    title: "Program Reseller",
    description:
      "Jadi reseller produk mitra NUSA-DHIPA. Margin kompetitif, tanpa modal stok besar.",
    tags: ["Tanpa stok", "Margin jelas", "Support mitra"],
    href: "/search",
    accent: "amber" as const,
  },
  {
    slug: "dropship",
    icon: "📦",
    title: "Dropship & Fulfillment",
    description:
      "Kirim langsung dari gudang mitra. Cocok untuk toko online tanpa gudang sendiri.",
    tags: ["Tanpa gudang", "Packing mitra", "Ongkir efisien"],
    href: "/search",
    accent: "red" as const,
  },
  {
    slug: "kemitraan",
    icon: "💼",
    title: "Kemitraan Strategis",
    description:
      "Bangun kerja sama jangka panjang: joint venture, distribusi eksklusif, atau co-branding.",
    tags: ["Joint venture", "Distribusi", "Co-branding"],
    href: "/umkm",
    accent: "green" as const,
  },
  {
    slug: "logistik",
    icon: "🚚",
    title: "Logistik & Ekspedisi",
    description:
      "Solusi pengiriman untuk bisnis: kargo, cold chain, dan pengiriman antar pulau.",
    tags: ["Kargo", "Cold chain", "Antar pulau"],
    href: "/search",
    accent: "amber" as const,
  },
];

const b2bSteps = [
  { num: "01", icon: "🔍", title: "Cari supplier", description: "Jelajahi direktori supplier sesuai kategori kebutuhan usaha." },
  { num: "02", icon: "💬", title: "Ajukan permintaan", description: "Kirim request quote atau hubungi supplier langsung." },
  { num: "03", icon: "📝", title: "Bandingkan penawaran", description: "Bandingkan harga, MOQ, dan waktu pengiriman." },
  { num: "04", icon: "✅", title: "Transaksi & kirim", description: "Sepakati kontrak, lakukan pembayaran, terima barang." },
];

function ServiceCard({ item }: { item: (typeof b2bServices)[number] }) {
  return (
    <Link href={item.href} className={`nd-opp-card nd-opp-card--${item.accent}`}>
      <span className="nd-opp-card__icon" aria-hidden="true">{item.icon}</span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <ul className="nd-opp-card__tags">
        {item.tags.map((tag) => (<li key={tag}>{tag}</li>))}
      </ul>
      <span className="nd-opp-card__cta">Jelajahi <span aria-hidden="true">→</span></span>
    </Link>
  );
}

function StepCard({ num, icon, title, description }: { num: string; icon: string; title: string; description: string }) {
  return (
    <li className="nd-step-card">
      <span className="nd-step-card__num" aria-hidden="true">{num}</span>
      <span className="nd-step-card__icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
}

/* ---------- Helpers ---------- */

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
export default async function B2BPage({ searchParams }: PageProps) {
  await searchParams;

  let products: Product[] = [];
  try {
    const raw = await getProducts({ limit: 100 });
    products = extractApiList<Product>(raw);
  } catch {
    products = [];
  }

  return (
    <main className="nd-marketplace">
      <div className="nd-content">
        <Reveal>
          <nav className="nd-breadcrumb" aria-label="Navigasi halaman" style={{ marginBottom: 16 }}>
            <Link href="/">Beranda</Link>
            <span aria-hidden="true">›</span>
            <span>B2B Marketplace</span>
          </nav>
        </Reveal>

        <Reveal>
          <section className="nd-opp-hero" aria-labelledby="nd-b2b-title">
            <div className="nd-opp-hero__content">
              <span className="nd-pill">BUSINESS TO BUSINESS</span>
              <h1 id="nd-b2b-title">Belanja grosir,<br />untuk kebutuhan bisnis.</h1>
              <p>Hubungkan usaha Anda dengan supplier, grosir, distributor, dan mitra pengadaan terpercaya di seluruh Indonesia. Harga khusus, volume besar, dan layanan profesional.</p>
              <div className="nd-opp-hero__actions">
                <Link href="/search" className="nd-opp-btn nd-opp-btn--primary">Jelajahi Produk <span aria-hidden="true">→</span></Link>
                <Link href="/umkm" className="nd-opp-btn nd-opp-btn--ghost">Lihat Mitra Usaha</Link>
              </div>
              <ul className="nd-opp-hero__points">
                <li><span aria-hidden="true">✓</span> Harga grosir</li>
                <li><span aria-hidden="true">✓</span> Supplier terverifikasi</li>
                <li><span aria-hidden="true">✓</span> Kontrak bisnis</li>
              </ul>
            </div>
            <div className="nd-opp-hero__art" aria-hidden="true">
              <div className="nd-opp-hero__art-card">
                <span>🏭</span>
                <strong>B2B Marketplace</strong>
                <small>Solusi usaha Anda</small>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ===== COUNTER + FORM RFQ ===== */}
        <Reveal delay={40}>
          <B2BContent products={products} />
        </Reveal>

        <Reveal delay={60}>
          <section className="nd-opp-section" aria-labelledby="nd-b2b-services-title">
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">LAYANAN B2B</span>
                <h2 id="nd-b2b-services-title">Solusi lengkap untuk bisnis</h2>
                <p>Dari pengadaan bahan baku hingga logistik — semua dalam satu ekosistem.</p>
              </div>
            </div>
            <div className="nd-opp-grid">
              {b2bServices.map((item) => (<ServiceCard key={item.slug} item={item} />))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={90}>
          <section className="nd-opp-section" aria-labelledby="nd-b2b-steps-title">
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">CARA KERJA</span>
                <h2 id="nd-b2b-steps-title">Empat langkah, transaksi B2B</h2>
                <p>Proses pengadaan yang jelas, transparan, dan terpercaya.</p>
              </div>
            </div>
            <ol className="nd-step-list">
              {b2bSteps.map((s) => (<StepCard key={s.num} num={s.num} icon={s.icon} title={s.title} description={s.description} />))}
            </ol>
          </section>
        </Reveal>

        <Reveal delay={120}>
          <section className="nd-opp-section nd-opp-faq" aria-labelledby="nd-b2b-faq-title">
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">PERTANYAAN UMUM</span>
                <h2 id="nd-b2b-faq-title">Seputar B2B Marketplace</h2>
              </div>
            </div>
            <div className="nd-faq-grid">
              <details className="nd-faq-item"><summary>Apa minimum order untuk transaksi B2B?<span aria-hidden="true">+</span></summary><p>Minimum order (MOQ) berbeda-beda tiap supplier. Sebagian besar mitra menyediakan harga khusus untuk pembelian dalam jumlah besar atau kontrak rutin.</p></details>
              <details className="nd-faq-item"><summary>Bagaimana cara mengajukan penawaran?<span aria-hidden="true">+</span></summary><p>Hubungi supplier langsung melalui kontak di halaman produk. Anda dapat menegosiasikan harga, MOQ, dan jadwal pengiriman.</p></details>
              <details className="nd-faq-item"><summary>Apakah ada biaya langganan B2B?<span aria-hidden="true">+</span></summary><p>Tidak. NUSA-DHIPA tidak memungut biaya untuk mengakses direktori B2B. Biaya hanya berlaku untuk transaksi yang Anda sepakati dengan supplier.</p></details>
              <details className="nd-faq-item"><summary>Apakah bisa kirim antar pulau?<span aria-hidden="true">+</span></summary><p>Ya. Banyak mitra logistik kami mendukung pengiriman antar pulau, termasuk kargo dan cold chain untuk produk tertentu.</p></details>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="nd-opp-cta" aria-labelledby="nd-b2b-cta-title">
            <div className="nd-opp-cta__symbol" aria-hidden="true">🏭</div>
            <div>
              <span className="nd-eyebrow">MULAI PENGADAAN</span>
              <h2 id="nd-b2b-cta-title">Siap memenuhi kebutuhan bisnis Anda?</h2>
              <p>Daftarkan usaha Anda sebagai mitra B2B NUSA-DHIPA, atau jelajahi supplier yang sudah terdaftar.</p>
            </div>
            <div className="nd-opp-cta__actions">
              <Link href="/daftar" className="nd-opp-cta__btn">Daftar Mitra <span aria-hidden="true">→</span></Link>
              <Link href="/search" className="nd-opp-cta__btn nd-opp-cta__btn--ghost">Cari Supplier</Link>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <div className="nd-marketplace-note">
            Informasi supplier dan produk mengikuti data yang tersedia dari katalog NUSA-DHIPA. Pastikan setiap kesepakatan bisnis dibuat dalam perjanjian tertulis.
          </div>
        </Reveal>
      </div>
    </main>
  );
}