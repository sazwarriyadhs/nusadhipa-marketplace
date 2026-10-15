import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import { getProducts, type Product } from "@/lib/marketplace-api";
import { PeluangContent } from "@/components/PeluangContent";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; tipe?: string }>;
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
    "opportunities",
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

/* ---------- Static: jenis peluang ---------- */

type OpportunityType = {
  slug: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  accent?: "red" | "green" | "amber";
};

const opportunityTypes: OpportunityType[] = [
  {
    slug: "reseller",
    icon: "🛒",
    title: "Program Reseller",
    description:
      "Jual kembali produk mitra NUSA-DHIPA tanpa modal besar. Cocok untuk yang baru mulai usaha online.",
    tags: ["Tanpa modal besar", "Komisi menarik", "Support mitra"],
    href: "/search?category=makanan-minuman",
    accent: "red",
  },
  {
    slug: "dropship",
    icon: "📦",
    title: "Dropship & Supplier",
    description:
      "Hubungkan toko online-mu dengan supplier lokal terpercaya. Stok, packing, dan kirim dari mitra.",
    tags: ["Tanpa stok", "Supplier terverifikasi", "Margin jelas"],
    href: "/search",
    accent: "amber",
  },
  {
    slug: "b2b",
    icon: "🏭",
    title: "Pengadaan B2B",
    description:
      "Cari pemasok untuk kebutuhan usaha: bahan baku, kemasan, alat produksi, hingga logistik.",
    tags: ["Grosir", "Kontrak usaha", "Volume besar"],
    href: "/search",
    accent: "green",
  },
  {
    slug: "kemitraan",
    icon: "🤝",
    title: "Kemitraan Usaha",
    description:
      "Temukan mitra strategis untuk kolaborasi produk, distribusi, atau pengembangan pasar baru.",
    tags: ["Joint venture", "Distribusi", "Co-branding"],
    href: "/umkm",
    accent: "red",
  },
  {
    slug: "franchise",
    icon: "🏪",
    title: "Waralaba & Lisensi",
    description:
      "Peluang membuka cabang usaha yang sudah terbukti. Brand lokal dengan sistem yang siap pakai.",
    tags: ["Brand lokal", "Sistem siap", "Pendampingan"],
    href: "/search",
    accent: "amber",
  },
  {
    slug: "agregator",
    icon: "🌾",
    title: "Agregator Hasil Tani",
    description:
      "Kumpulkan hasil pertanian, peternakan, atau perikanan dari petani lokal untuk pasar yang lebih luas.",
    tags: ["Hasil tani", "Pedesaan", "Pasar luas"],
    href: "/search?category=pertanian-peternakan",
    accent: "green",
  },
];

/* ---------- Static: langkah mulai ---------- */

const steps = [
  {
    num: "01",
    icon: "🔍",
    title: "Jelajahi peluang",
    description:
      "Pilih jenis peluang yang paling cocok dengan modal, waktu, dan keahlianmu.",
  },
  {
    num: "02",
    icon: "🔗",
    title: "Hubungi mitra",
    description:
      "Terhubung langsung dengan pelaku usaha untuk diskusi detail kerja sama.",
  },
  {
    num: "03",
    icon: "📝",
    title: "Sepakati kerja sama",
    description:
      "Atur skema, margin, dan target bersama. Semua jelas sejak awal.",
  },
  {
    num: "04",
    icon: "🚀",
    title: "Mulai jalankan",
    description:
      "Jalankan usaha dengan dukungan katalog, mitra, dan ekosistem NUSA-DHIPA.",
  },
];

/* ---------- Components ---------- */

function OpportunityCard({ item }: { item: OpportunityType }) {
  return (
    <Link
      href={item.href}
      className={`nd-opp-card nd-opp-card--${item.accent ?? "red"}`}
    >
      <span className="nd-opp-card__icon" aria-hidden="true">
        {item.icon}
      </span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <ul className="nd-opp-card__tags">
        {item.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <span className="nd-opp-card__cta">
        Jelajahi <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

function StepCard({
  num,
  icon,
  title,
  description,
}: {
  num: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <li className="nd-step-card">
      <span className="nd-step-card__num" aria-hidden="true">
        {num}
      </span>
      <span className="nd-step-card__icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
}

/* ---------- Page ---------- */

export default async function PeluangUsahaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  let products: Product[] = [];
  let productsError = false;

  try {
    const raw = await getProducts({
      q: query || undefined,
      limit: 24,
    });
    products = extractApiList<Product>(raw);
  } catch {
    productsError = true;
  }

  const uniqueSellers = Array.from(
    new Set(
      products
        .map((p) => p.business_name?.trim())
        .filter((n): n is string => Boolean(n)),
    ),
  ).slice(0, 6);

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
            <span>Peluang Usaha</span>
          </nav>
        </Reveal>

        <Reveal>
          <section className="nd-opp-hero" aria-labelledby="nd-opp-title">
            <div className="nd-opp-hero__content">
              <span className="nd-pill">PELUANG USAHA & KEMITRAAN</span>
              <h1 id="nd-opp-title">
                Bangun usaha,
                <br />
                tumbuh bersama.
              </h1>
              <p>
                Temukan peluang reseller, dropship, kemitraan, hingga
                pengadaan B2B dari pelaku usaha Nusantara. Mulai dari
                yang kecil, tumbuh jadi besar.
              </p>
              <div className="nd-opp-hero__actions">
                <Link
                  href="#jenis-peluang"
                  className="nd-opp-btn nd-opp-btn--primary"
                >
                  Jelajahi Peluang <span aria-hidden="true">→</span>
                </Link>
                <Link href="/umkm" className="nd-opp-btn nd-opp-btn--ghost">
                  Lihat Mitra Usaha
                </Link>
              </div>
              <ul className="nd-opp-hero__points">
                <li>
                  <span aria-hidden="true">✓</span> Tanpa modal besar
                </li>
                <li>
                  <span aria-hidden="true">✓</span> Mitra terverifikasi
                </li>
                <li>
                  <span aria-hidden="true">✓</span> Dukungan ekosistem
                </li>
              </ul>
            </div>
            <div className="nd-opp-hero__art" aria-hidden="true">
              <div className="nd-opp-hero__art-card">
                <span>🚀</span>
                <strong>Mulai hari ini</strong>
                <small>Kembangkan usahamu</small>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ===== COUNTER + FILTER + KALKULATOR ===== */}
        <Reveal delay={40}>
          <PeluangContent products={products} />
        </Reveal>

        <Reveal delay={60}>
          <section
            id="jenis-peluang"
            className="nd-opp-section"
            aria-labelledby="nd-opp-types-title"
          >
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">JENIS PELUANG</span>
                <h2 id="nd-opp-types-title">Pilih jalur usahamu</h2>
                <p>
                  Setiap jalur punya karakter berbeda. Pilih yang paling
                  sesuai dengan modal dan waktumu.
                </p>
              </div>
            </div>
            <div className="nd-opp-grid">
              {opportunityTypes.map((item) => (
                <OpportunityCard key={item.slug} item={item} />
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={90}>
          <section
            className="nd-opp-section"
            aria-labelledby="nd-opp-steps-title"
          >
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">CARA MULAI</span>
                <h2 id="nd-opp-steps-title">
                  Empat langkah, langsung jalan
                </h2>
                <p>
                  Dari cari peluang sampai buka usaha — semuanya bisa
                  dilakukan lewat ekosistem NUSA-DHIPA.
                </p>
              </div>
            </div>
            <ol className="nd-step-list">
              {steps.map((s) => (
                <StepCard
                  key={s.num}
                  num={s.num}
                  icon={s.icon}
                  title={s.title}
                  description={s.description}
                />
              ))}
            </ol>
          </section>
        </Reveal>

        {!productsError && uniqueSellers.length > 0 ? (
          <Reveal delay={120}>
            <section
              className="nd-opp-section"
              aria-labelledby="nd-opp-sellers-title"
            >
              <div className="nd-section-heading">
                <div>
                  <span className="nd-eyebrow">MITRA POTENSIAL</span>
                  <h2 id="nd-opp-sellers-title">
                    Siap diajak kerja sama
                  </h2>
                  <p>
                    Beberapa mitra yang aktif di katalog NUSA-DHIPA dan
                    terbuka untuk peluang kerja sama.
                  </p>
                </div>
                <Link href="/umkm" className="nd-section-link">
                  Semua mitra <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="nd-opp-sellers">
                {uniqueSellers.map((name) => {
                  const initials = name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase() ?? "")
                    .join("");

                  return (
                    <Link
                      key={name}
                      href={`/search?q=${encodeURIComponent(name)}`}
                      className="nd-opp-seller-chip"
                    >
                      <span
                        className="nd-opp-seller-chip__avatar"
                        aria-hidden="true"
                      >
                        {initials || "🏪"}
                      </span>
                      <span className="nd-opp-seller-chip__name">
                        {name}
                      </span>
                      <span
                        className="nd-opp-seller-chip__arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </Reveal>
        ) : null}

        <Reveal delay={150}>
          <section
            className="nd-opp-section nd-opp-faq"
            aria-labelledby="nd-opp-faq-title"
          >
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">PERTANYAAN UMUM</span>
                <h2 id="nd-opp-faq-title">Sebelum kamu mulai</h2>
              </div>
            </div>
            <div className="nd-faq-grid">
              <details className="nd-faq-item">
                <summary>
                  Apakah perlu modal besar untuk mulai?
                  <span aria-hidden="true">+</span>
                </summary>
                <p>
                  Tidak. Banyak program reseller dan dropship bisa
                  dimulai tanpa modal besar. Fokus utamanya adalah
                  jaringan dan konsistensi.
                </p>
              </details>
              <details className="nd-faq-item">
                <summary>
                  Bagaimana cara menghubungi mitra?
                  <span aria-hidden="true">+</span>
                </summary>
                <p>
                  Setiap mitra memiliki kontak di halaman produk atau
                  profil usaha. Kamu bisa menghubungi langsung untuk
                  mendiskusikan skema kerja sama.
                </p>
              </details>
              <details className="nd-faq-item">
                <summary>
                  Apakah ada biaya pendaftaran?
                  <span aria-hidden="true">+</span>
                </summary>
                <p>
                  NUSA-DHIPA tidak memungut biaya untuk bergabung
                  sebagai mitra. Pastikan setiap kesepakatan usaha
                  dibicarakan transparan dengan mitra terkait.
                </p>
              </details>
              <details className="nd-faq-item">
                <summary>
                  Bagaimana kalau saya butuh bantuan?
                  <span aria-hidden="true">+</span>
                </summary>
                <p>
                  Tim NUSA-DHIPA dan mitra akan membantu proses awal.
                  Untuk pertanyaan lebih lanjut, silakan hubungi
                  kontak resmi yang tertera di katalog.
                </p>
              </details>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="nd-opp-cta" aria-labelledby="nd-opp-cta-title">
            <div className="nd-opp-cta__symbol" aria-hidden="true">
              🚀
            </div>
            <div>
              <span className="nd-eyebrow">SIAP MULAI USAHA?</span>
              <h2 id="nd-opp-cta-title">
                Daftarkan usahamu, jangkau lebih luas.
              </h2>
              <p>
                Bergabung dengan ekosistem NUSA-DHIPA dan terhubung
                dengan ribuan pelaku usaha di seluruh Indonesia.
              </p>
            </div>
            <div className="nd-opp-cta__actions">
              <Link href="/daftar" className="nd-opp-cta__btn">
                Daftar Sekarang <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/umkm"
                className="nd-opp-cta__btn nd-opp-cta__btn--ghost"
              >
                Lihat Mitra
              </Link>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <div className="nd-marketplace-note">
            Informasi peluang usaha bersifat umum. Pastikan setiap
            kesepakatan kerja sama dibicarakan langsung dengan mitra
            terkait.
          </div>
        </Reveal>
      </div>
    </main>
  );
}
