import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";
import { KbliContent, type KbliCategory } from "@/components/KbliContent";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; kategori?: string }>;
};

const kbliCategories = [
  { code: "A", icon: "🌾", title: "Pertanian, Kehutanan & Perikanan", description: "Mencakup budidaya tanaman, peternakan, perikanan, dan pemanfaatan hasil hutan.", examples: ["Budidaya padi", "Peternakan ayam", "Budidaya ikan"], accent: "green" as const },
  { code: "C", icon: "🏭", title: "Industri Pengolahan", description: "Pengolahan bahan mentah menjadi barang jadi atau setengah jadi untuk konsumsi atau industri lanjutan.", examples: ["Industri makanan", "Pengolahan kayu", "Tekstil"], accent: "red" as const },
  { code: "F", icon: "🏗️", title: "Konstruksi", description: "Pembangunan gedung, infrastruktur, dan pekerjaan konstruksi khusus.", examples: ["Bangun rumah", "Jalan & jembatan", "Instalasi listrik"], accent: "amber" as const },
  { code: "G", icon: "🛒", title: "Perdagangan Besar & Eceran", description: "Perdagangan produk tanpa pengolahan, termasuk e-commerce dan grosir.", examples: ["Toko ritel", "Grosir bahan pokok", "E-commerce"], accent: "red" as const },
  { code: "I", icon: "🍽️", title: "Akomodasi & Penyediaan Makanan", description: "Jasa penginapan, restoran, katering, dan penyediaan makanan minuman.", examples: ["Restoran", "Katering", "Hotel"], accent: "amber" as const },
  { code: "J", icon: "💻", title: "Informasi & Komunikasi", description: "Penerbitan, perfilman, telekomunikasi, pemrograman, dan jasa informasi.", examples: ["Aplikasi mobile", "Hosting web", "Media digital"], accent: "green" as const },
  { code: "M", icon: "📊", title: "Jasa Profesional & Ilmiah", description: "Konsultan, desainer, akuntan, pengacara, dan jasa profesional lainnya.", examples: ["Konsultan pajak", "Desain grafis", "Arsitek"], accent: "red" as const },
  { code: "P", icon: "🎓", title: "Pendidikan", description: "Pendidikan formal, non-formal, kursus, dan pelatihan keterampilan.", examples: ["Kursus bahasa", "Bimbel", "Pelatihan vokasi"], accent: "green" as const },
  { code: "R", icon: "🎨", title: "Kesenian, Hiburan & Rekreasi", description: "Kegiatan seni pertunjukan, museum, olahraga, dan rekreasi.", examples: ["Studio musik", "Galeri seni", "Klub olahraga"], accent: "amber" as const },
];

const steps = [
  { num: "01", icon: "🔍", title: "Kenali bidang usahamu", description: "Tentukan kategori utama dari kegiatan usaha yang akan dijalankan." },
  { num: "02", icon: "🔗", title: "Cari kode KBLI", description: "Telusuri kode 5 digit yang paling sesuai dengan kegiatan usaha." },
  { num: "03", icon: "✅", title: "Verifikasi sumber resmi", description: "Cocokkan dengan sumber resmi (OSS, BPKM, atau peraturan terbaru)." },
  { num: "04", icon: "🚀", title: "Daftarkan usaha", description: "Gunakan kode KBLI untuk keperluan perizinan dan legalitas usaha." },
];

function CategoryCard({ item }: { item: (typeof kbliCategories)[number] }) {
  return (
    <article className={`nd-opp-card nd-opp-card--${item.accent}`}>
      <div className="nd-opp-card__icon-wrap">
        <span className="nd-opp-card__icon" aria-hidden="true">{item.icon}</span>
        <span className="nd-opp-card__badge">KBLI {item.code}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <ul className="nd-opp-card__tags">
        {item.examples.map((ex) => (<li key={ex}>{ex}</li>))}
      </ul>
    </article>
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

export default async function Kbli2025Page({ searchParams }: PageProps) {
  await searchParams;

  return (
    <main className="nd-marketplace">
      <div className="nd-content">
        <Reveal>
          <nav className="nd-breadcrumb" aria-label="Navigasi halaman" style={{ marginBottom: 16 }}>
            <Link href="/">Beranda</Link>
            <span aria-hidden="true">›</span>
            <span>KBLI 2025</span>
          </nav>
        </Reveal>

        <Reveal>
          <section className="nd-opp-hero" aria-labelledby="nd-kbli-title">
            <div className="nd-opp-hero__content">
              <span className="nd-pill">REFERENSI KEGIATAN USAHA</span>
              <h1 id="nd-kbli-title">Pahami KBLI,<br />legalitas usaha jadi jelas.</h1>
              <p>KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) adalah kode 5 digit yang mengklasifikasikan kegiatan usaha di Indonesia. Gunakan referensi ini untuk menemukan kode yang sesuai dengan bisnismu.</p>
              <div className="nd-opp-hero__actions">
                <Link href="#kategori-kbli" className="nd-opp-btn nd-opp-btn--primary">Lihat Kategori <span aria-hidden="true">→</span></Link>
                <Link href="/umkm" className="nd-opp-btn nd-opp-btn--ghost">Lihat Mitra</Link>
              </div>
              <ul className="nd-opp-hero__points">
                <li><span aria-hidden="true">✓</span> 9 kategori utama</li>
                <li><span aria-hidden="true">✓</span> Contoh kegiatan usaha</li>
                <li><span aria-hidden="true">✓</span> Referensi OSS & BPKM</li>
              </ul>
            </div>
            <div className="nd-opp-hero__art" aria-hidden="true">
              <div className="nd-opp-hero__art-card">
                <span>📚</span>
                <strong>KBLI 2025</strong>
                <small>Panduan klasifikasi</small>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ===== KBLI INTERAKTIF: Counter + Search + Filter + Grid + Modal ===== */}
        <Reveal delay={60}>
          <section id="kategori-kbli" className="nd-opp-section" aria-labelledby="nd-kbli-cats-title">
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">KATEGORI KBLI</span>
                <h2 id="nd-kbli-cats-title">Kategori utama kegiatan usaha</h2>
                <p>Cari, filter, dan lihat detail kategori KBLI yang paling umum dipakai pelaku usaha.</p>
              </div>
            </div>
            <KbliContent categories={kbliCategories as KbliCategory[]} />
          </section>
        </Reveal>

        <Reveal delay={90}>
          <section className="nd-opp-section" aria-labelledby="nd-kbli-steps-title">
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">CARA PAKAI</span>
                <h2 id="nd-kbli-steps-title">Empat langkah, temukan KBLI-mu</h2>
                <p>Panduan singkat untuk menentukan kode KBLI yang tepat bagi usahamu.</p>
              </div>
            </div>
            <ol className="nd-step-list">
              {steps.map((s) => (<StepCard key={s.num} num={s.num} icon={s.icon} title={s.title} description={s.description} />))}
            </ol>
          </section>
        </Reveal>

        <Reveal delay={120}>
          <section className="nd-opp-section nd-opp-faq" aria-labelledby="nd-kbli-faq-title">
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">PERTANYAAN UMUM</span>
                <h2 id="nd-kbli-faq-title">Seputar KBLI</h2>
              </div>
            </div>
            <div className="nd-faq-grid">
              <details className="nd-faq-item"><summary>Apa itu KBLI?<span aria-hidden="true">+</span></summary><p>KBLI adalah Klasifikasi Baku Lapangan Usaha Indonesia — sistem pengelompokan kegiatan usaha yang dipakai untuk perizinan, statistik, dan administrasi pemerintahan.</p></details>
              <details className="nd-faq-item"><summary>Berapa digit kode KBLI?<span aria-hidden="true">+</span></summary><p>Kode KBLI terdiri dari 5 digit angka. Setiap digit menunjukkan tingkat klasifikasi dari kategori umum hingga sub-kegiatan yang paling spesifik.</p></details>
              <details className="nd-faq-item"><summary>Di mana daftar resmi KBLI 2025?<span aria-hidden="true">+</span></summary><p>Daftar resmi KBLI dapat diakses melalui situs OSS (Online Single Submission) dan situs resmi Badan Pusat Statistik. Selalu rujuk sumber resmi untuk data terbaru.</p></details>
              <details className="nd-faq-item"><summary>Apakah saya harus punya KBLI?<span aria-hidden="true">+</span></summary><p>Untuk usaha yang memerlukan legalitas formal (perizinan, NPWP, NIB), kode KBLI wajib dicantumkan. Untuk usaha mikro informal, disarankan tetap menyesuaikan dengan KBLI.</p></details>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="nd-opp-cta" aria-labelledby="nd-kbli-cta-title">
            <div className="nd-opp-cta__symbol" aria-hidden="true">📚</div>
            <div>
              <span className="nd-eyebrow">BUTUH REFERENSI LAIN?</span>
              <h2 id="nd-kbli-cta-title">Cek juga panduan usaha lainnya</h2>
              <p>Jelajahi halaman peluang usaha, direktori mitra, dan layanan B2B NUSA-DHIPA untuk mendukung bisnismu.</p>
            </div>
            <div className="nd-opp-cta__actions">
              <Link href="/peluang-usaha" className="nd-opp-cta__btn">Peluang Usaha <span aria-hidden="true">→</span></Link>
              <Link href="/bantuan" className="nd-opp-cta__btn nd-opp-cta__btn--ghost">Bantuan</Link>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <div className="nd-marketplace-note">
            Halaman ini bersifat referensi umum. Untuk keperluan legalitas usaha, selalu rujuk sumber resmi seperti OSS, BPKM, atau peraturan pemerintah terbaru.
          </div>
        </Reveal>
      </div>
    </main>
  );
}