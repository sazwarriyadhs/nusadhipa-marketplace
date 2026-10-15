import Link from "next/link";
import { Reveal } from "@/components/home/Reveal";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

const faqTopics = [
  { slug: "akun", icon: "👤", title: "Akun & Pendaftaran", description: "Cara membuat akun, verifikasi, dan pengaturan profil pengguna.", tags: ["Daftar", "Verifikasi", "Profil"], accent: "red" as const },
  { slug: "produk", icon: "📦", title: "Produk & Katalog", description: "Menelusuri produk, mencari supplier, dan memahami informasi produk.", tags: ["Cari produk", "Kategori", "Filter"], accent: "green" as const },
  { slug: "transaksi", icon: "🛒", title: "Transaksi & Pembayaran", description: "Cara menghubungi mitra, menyepakati harga, dan menyelesaikan transaksi.", tags: ["Hubungi mitra", "Pembayaran", "Kontrak"], accent: "amber" as const },
  { slug: "mitra", icon: "🏪", title: "Menjadi Mitra Usaha", description: "Syarat, proses, dan manfaat bergabung sebagai mitra NUSA-DHIPA.", tags: ["Syarat", "Onboarding", "Benefit"], accent: "red" as const },
  { slug: "b2b", icon: "🏭", title: "B2B & Pengadaan", description: "Panduan pengadaan grosir, request quote, dan kontrak bisnis.", tags: ["Grosir", "Request quote", "Kontrak"], accent: "green" as const },
  { slug: "keamanan", icon: "🛡️", title: "Keamanan & Privasi", description: "Kebijakan keamanan data dan praktik privasi di NUSA-DHIPA.", tags: ["Data", "Privasi", "Keamanan"], accent: "amber" as const },
];

const contacts = [
  { icon: "📧", label: "Email", value: "support@nusa-dhipa.id", href: "mailto:support@nusa-dhipa.id" },
  { icon: "💬", label: "WhatsApp", value: "+62 812-3456-7890", href: "https://wa.me/6281234567890" },
  { icon: "🕘", label: "Jam Layanan", value: "Senin–Jumat, 09.00–17.00 WIB", href: null },
];

export default async function BantuanPage({ searchParams }: PageProps) {
  await searchParams;

  return (
    <main className="nd-marketplace">
      <div className="nd-content">
        <Reveal>
          <nav className="nd-breadcrumb" aria-label="Navigasi halaman" style={{ marginBottom: 16 }}>
            <Link href="/">Beranda</Link>
            <span aria-hidden="true">›</span>
            <span>Bantuan</span>
          </nav>
        </Reveal>

        <Reveal>
          <section className="nd-opp-hero" aria-labelledby="nd-bantuan-title">
            <div className="nd-opp-hero__content">
              <span className="nd-pill">PUSAT BANTUAN</span>
              <h1 id="nd-bantuan-title">Ada yang bisa<br />kami bantu?</h1>
              <p>Temukan jawaban atas pertanyaan umum seputar akun, produk, transaksi, kemitraan, dan B2B di NUSA-DHIPA.</p>
              <div className="nd-opp-hero__actions">
                <Link href="#topik" className="nd-opp-btn nd-opp-btn--primary">Lihat Topik <span aria-hidden="true">→</span></Link>
                <Link href="#kontak" className="nd-opp-btn nd-opp-btn--ghost">Hubungi Kami</Link>
              </div>
              <ul className="nd-opp-hero__points">
                <li><span aria-hidden="true">✓</span> Panduan lengkap</li>
                <li><span aria-hidden="true">✓</span> Respon cepat</li>
                <li><span aria-hidden="true">✓</span> Tim support siap bantu</li>
              </ul>
            </div>
            <div className="nd-opp-hero__art" aria-hidden="true">
              <div className="nd-opp-hero__art-card">
                <span>💬</span>
                <strong>Pusat Bantuan</strong>
                <small>Kami siap membantu</small>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={60}>
          <section id="topik" className="nd-opp-section" aria-labelledby="nd-bantuan-topics-title">
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">TOPIK BANTUAN</span>
                <h2 id="nd-bantuan-topics-title">Telusuri berdasarkan topik</h2>
                <p>Pilih topik yang paling sesuai dengan pertanyaanmu.</p>
              </div>
            </div>
            <div className="nd-opp-grid">
              {faqTopics.map((item) => (
                <article key={item.slug} className={`nd-opp-card nd-opp-card--${item.accent}`}>
                  <span className="nd-opp-card__icon" aria-hidden="true">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ul className="nd-opp-card__tags">
                    {item.tags.map((t) => (<li key={t}>{t}</li>))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={90}>
          <section className="nd-opp-section nd-opp-faq" aria-labelledby="nd-bantuan-faq-title">
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">PERTANYAAN UMUM</span>
                <h2 id="nd-bantuan-faq-title">Yang sering ditanyakan</h2>
              </div>
            </div>
            <div className="nd-faq-grid">
              <details className="nd-faq-item"><summary>Apakah NUSA-DHIPA gratis?<span aria-hidden="true">+</span></summary><p>Ya. NUSA-DHIPA tidak memungut biaya untuk menjelajahi katalog. Biaya hanya berlaku pada transaksi yang Anda sepakati dengan mitra.</p></details>
              <details className="nd-faq-item"><summary>Bagaimana cara menjadi mitra?<span aria-hidden="true">+</span></summary><p>Klik tombol &quot;Gabung sebagai mitra&quot; di footer atau kunjungi halaman /daftar untuk memulai proses pendaftaran.</p></details>
              <details className="nd-faq-item"><summary>Bagaimana cara menghubungi penjual?<span aria-hidden="true">+</span></summary><p>Setiap halaman produk menampilkan kontak mitra. Anda dapat menghubungi langsung via WhatsApp atau email yang tertera.</p></details>
              <details className="nd-faq-item"><summary>Apakah transaksi aman?<span aria-hidden="true">+</span></summary><p>Kami menyarankan transaksi dengan mitra terverifikasi dan selalu membuat perjanjian tertulis untuk transaksi B2B skala besar.</p></details>
              <details className="nd-faq-item"><summary>Bagaimana kebijakan pengembalian?<span aria-hidden="true">+</span></summary><p>Kebijakan pengembalian mengikuti ketentuan masing-masing mitra. Diskusikan langsung saat bertransaksi.</p></details>
              <details className="nd-faq-item"><summary>Bagaimana cara melaporkan masalah?<span aria-hidden="true">+</span></summary><p>Hubungi tim support melalui email atau WhatsApp pada bagian Kontak di bawah. Kami akan menindaklanjuti secepatnya.</p></details>
            </div>
          </section>
        </Reveal>

        <Reveal delay={120}>
          <section id="kontak" className="nd-opp-section" aria-labelledby="nd-bantuan-contact-title">
            <div className="nd-section-heading">
              <div>
                <span className="nd-eyebrow">KONTAK</span>
                <h2 id="nd-bantuan-contact-title">Masih butuh bantuan?</h2>
                <p>Tim kami siap membantu pada jam kerja.</p>
              </div>
            </div>
            <div className="nd-opp-grid">
              {contacts.map((item) => {
                const content = (
                  <>
                    <span className="nd-opp-card__icon" aria-hidden="true">{item.icon}</span>
                    <h3>{item.label}</h3>
                    <p>{item.value}</p>
                  </>
                );
                return item.href ? (
                  <a key={item.label} href={item.href} className="nd-opp-card nd-opp-card--red">
                    {content}
                  </a>
                ) : (
                  <div key={item.label} className="nd-opp-card nd-opp-card--red">
                    {content}
                  </div>
                );
              })}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="nd-opp-cta" aria-labelledby="nd-bantuan-cta-title">
            <div className="nd-opp-cta__symbol" aria-hidden="true">💬</div>
            <div>
              <span className="nd-eyebrow">MASIH BINGUNG?</span>
              <h2 id="nd-bantuan-cta-title">Kami siap membantu</h2>
              <p>Kirim pertanyaanmu ke tim support NUSA-DHIPA. Kami akan merespons pada jam kerja.</p>
            </div>
            <div className="nd-opp-cta__actions">
              <a href="mailto:support@nusa-dhipa.id" className="nd-opp-cta__btn">Kirim Email <span aria-hidden="true">→</span></a>
              <Link href="/" className="nd-opp-cta__btn nd-opp-cta__btn--ghost">Kembali Beranda</Link>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <div className="nd-marketplace-note">
            Pusat bantuan ini bersifat umum. Untuk kasus spesifik, silakan hubungi tim support melalui kontak resmi NUSA-DHIPA.
          </div>
        </Reveal>
      </div>
    </main>
  );
}