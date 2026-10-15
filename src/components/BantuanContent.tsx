"use client";

import { useMemo, useState } from "react";
import { CounterStat } from "@/components/CounterStat";

type FaqItem = {
  id: string;
  topic: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "f1",
    topic: "akun",
    question: "Bagaimana cara mendaftar akun NUSA-DHIPA?",
    answer:
      "Klik tombol Masuk/Daftar di header, pilih peran (Pembeli atau Mitra Usaha), lalu isi formulir dengan email aktif dan kata sandi. Verifikasi email akan dikirim untuk mengaktifkan akun Anda.",
  },
  {
    id: "f2",
    topic: "akun",
    question: "Apakah akun bisa digunakan sebagai pembeli & mitra sekaligus?",
    answer:
      "Saat ini satu akun memiliki satu peran utama. Untuk menjadi mitra usaha, silakan daftar ulang dengan email berbeda atau hubungi tim support untuk upgrade akun.",
  },
  {
    id: "f3",
    topic: "produk",
    question: "Bagaimana cara mencari produk tertentu?",
    answer:
      "Gunakan kolom pencarian di header atau halaman /search. Anda bisa memfilter berdasarkan kategori, kata kunci, atau nama mitra usaha. Hasil pencarian ditampilkan real-time.",
  },
  {
    id: "f4",
    topic: "produk",
    question: "Apakah semua produk sudah terverifikasi?",
    answer:
      "Setiap mitra wajib melalui verifikasi data usaha sebelum produknya tayang. Namun kami tetap menyarankan Anda untuk memeriksa detail produk dan berkomunikasi langsung dengan mitra sebelum transaksi.",
  },
  {
    id: "f5",
    topic: "transaksi",
    question: "Bagaimana cara menghubungi mitra usaha?",
    answer:
      "Setelah masuk ke halaman detail produk, klik tombol Hubungi Mitra atau gunakan WhatsApp mitra yang tertera. Anda dapat mendiskusikan harga, jumlah, dan pengiriman langsung dengan mitra.",
  },
  {
    id: "f6",
    topic: "transaksi",
    question: "Apakah NUSA-DHIPA menyediakan pembayaran otomatis?",
    answer:
      "Saat ini transaksi disepakati langsung antara pembeli dan mitra. Kami sedang mengembangkan fitur pembayaran terintegrasi agar lebih aman dan praktis.",
  },
  {
    id: "f7",
    topic: "mitra",
    question: "Apa syarat menjadi mitra usaha NUSA-DHIPA?",
    answer:
      "Anda perlu memiliki usaha aktif dengan NIB atau legalitas dasar, produk yang jelas, serta komitmen melayani pembeli dengan baik. Proses verifikasi memakan waktu 1-3 hari kerja.",
  },
  {
    id: "f8",
    topic: "mitra",
    question: "Apakah ada biaya untuk bergabung sebagai mitra?",
    answer:
      "Tidak. Bergabung sebagai mitra NUSA-DHIPA saat ini gratis. Kami hanya meminta Anda menjaga kualitas produk dan layanan kepada pembeli.",
  },
  {
    id: "f9",
    topic: "b2b",
    question: "Bagaimana cara mengajukan Request for Quote (RFQ)?",
    answer:
      "Buka halaman /b2b, isi formulir RFQ dengan nama, produk, jumlah, dan nomor WhatsApp. Permintaan Anda akan diteruskan langsung ke mitra terkait via WhatsApp.",
  },
  {
    id: "f10",
    topic: "b2b",
    question: "Apakah tersedia harga khusus untuk pembelian grosir?",
    answer:
      "Ya. Banyak mitra menyediakan harga khusus untuk pembelian volume besar. Silakan diskusikan langsung dengan mitra melalui RFQ atau kontak yang tersedia.",
  },
];

const TOPIC_FILTERS = [
  { id: "all", label: "Semua", icon: "🎯" },
  { id: "akun", label: "Akun", icon: "👤" },
  { id: "produk", label: "Produk", icon: "📦" },
  { id: "transaksi", label: "Transaksi", icon: "🛒" },
  { id: "mitra", label: "Mitra", icon: "🏪" },
  { id: "b2b", label: "B2B", icon: "🏭" },
] as const;

export function BantuanContent() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const visibleFaq = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      if (topic !== "all" && item.topic !== topic) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [query, topic]);

  return (
    <>
      {/* Counter */}
      <section aria-label="Statistik bantuan" style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
          }}
        >
          <CounterStat value={TOPIC_FILTERS.length - 1} label="Topik Bantuan" icon="📚" />
          <CounterStat value={FAQ_ITEMS.length} label="Artikel FAQ" icon="❓" />
          <CounterStat value={24} label="Respon (jam)" icon="⚡" />
        </div>
      </section>

      {/* Search */}
      <section aria-label="Cari FAQ" style={{ marginBottom: 20 }}>
        <div className="nd-kbli-search">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pertanyaan atau topik bantuan..."
            aria-label="Cari FAQ"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="nd-kbli-search__clear"
              aria-label="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Filter topik */}
      <section aria-label="Filter topik" style={{ marginBottom: 24 }}>
        <div className="nd-peluang-filter" role="tablist">
          {TOPIC_FILTERS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={topic === t.id}
              onClick={() => setTopic(t.id)}
              className={`nd-peluang-filter__btn${topic === t.id ? " is-active" : ""}`}
            >
              <span aria-hidden="true">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section aria-label="FAQ" style={{ marginBottom: 40 }}>
        {visibleFaq.length === 0 ? (
          <div className="nd-promo-empty">
            <span aria-hidden="true">🔎</span>
            <p>Tidak ada pertanyaan yang cocok. Coba kata kunci lain.</p>
          </div>
        ) : (
          <div className="nd-faq-accordion">
            {visibleFaq.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`nd-faq-item-acc${isOpen ? " is-open" : ""}`}
                >
                  <button
                    type="button"
                    className="nd-faq-item-acc__q"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span className="nd-faq-item-acc__icon" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="nd-faq-item-acc__a">{item.answer}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}