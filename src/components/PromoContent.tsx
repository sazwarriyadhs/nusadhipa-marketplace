"use client";

import { useMemo, useState } from "react";
import { CounterStat } from "@/components/CounterStat";
import type { Product } from "@/lib/marketplace-api";

type PromoType = "all" | "diskon" | "bundling" | "cashback" | "ongkir";

const PROMO_FILTERS: { id: PromoType; label: string; icon: string }[] = [
  { id: "all", label: "Semua", icon: "🎯" },
  { id: "diskon", label: "Diskon", icon: "💰" },
  { id: "bundling", label: "Bundling", icon: "📦" },
  { id: "cashback", label: "Cashback", icon: "🎁" },
  { id: "ongkir", label: "Gratis Ongkir", icon: "🚚" },
];

type PromoItem = {
  id: string;
  type: PromoType;
  title: string;
  desc: string;
  code: string;
  diskon: number;
  minBelanja: number;
  berlakuSampai: string;
};

const SAMPLE_PROMOS: PromoItem[] = [
  {
    id: "p1",
    type: "diskon",
    title: "Diskon 15% Pembelian Pertama",
    desc: "Berlaku untuk semua produk, maks. Rp50.000",
    code: "NEW15",
    diskon: 15,
    minBelanja: 100000,
    berlakuSampai: "31 Des 2026",
  },
  {
    id: "p2",
    type: "bundling",
    title: "Bundling Ikan Segar 3 Pack",
    desc: "Beli 3 pack ikan segar, gratis 1 pack",
    code: "IKAN3FREE1",
    diskon: 25,
    minBelanja: 200000,
    berlakuSampai: "30 Nov 2026",
  },
  {
    id: "p3",
    type: "cashback",
    title: "Cashback Rp20.000",
    desc: "Min. belanja Rp150.000 untuk produk pakan",
    code: "PAKAN20",
    diskon: 13,
    minBelanja: 150000,
    berlakuSampai: "15 Des 2026",
  },
  {
    id: "p4",
    type: "ongkir",
    title: "Gratis Ongkir Se-Indonesia",
    desc: "Min. belanja Rp100.000, maks. potongan Rp25.000",
    code: "FREESHIP",
    diskon: 0,
    minBelanja: 100000,
    berlakuSampai: "31 Des 2026",
  },
  {
    id: "p5",
    type: "diskon",
    title: "Diskon Grosir B2B 20%",
    desc: "Untuk pembelian min. 50 kg, khusus mitra B2B",
    code: "B2BGROSIR",
    diskon: 20,
    minBelanja: 500000,
    berlakuSampai: "31 Jan 2027",
  },
  {
    id: "p6",
    type: "bundling",
    title: "Paket Usaha Pemula",
    desc: "Bundling 5 produk pilihan + panduan usaha",
    code: "USAHAWOW",
    diskon: 30,
    minBelanja: 300000,
    berlakuSampai: "20 Des 2026",
  },
];

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function PromoContent({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<PromoType>("all");
  const [copied, setCopied] = useState<string>("");

  const stats = useMemo(() => {
    const sellers = new Set(
      products.map((p) => p.business_name).filter(Boolean)
    );
    return {
      totalPromos: SAMPLE_PROMOS.length,
      totalSellers: sellers.size,
      totalProducts: products.length,
    };
  }, [products]);

  const visiblePromos = useMemo(() => {
    if (filter === "all") return SAMPLE_PROMOS;
    return SAMPLE_PROMOS.filter((p) => p.type === filter);
  }, [filter]);

  function copyCode(code: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(""), 2000);
    }
  }

  return (
    <>
      <section aria-label="Statistik promo" style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
          }}
        >
          <CounterStat value={stats.totalPromos} label="Promo Aktif" icon="🎁" />
          <CounterStat value={stats.totalSellers} label="Mitra" icon="🤝" />
          <CounterStat value={stats.totalProducts} label="Produk" icon="📦" />
        </div>
      </section>

      <section aria-label="Filter promo" style={{ marginBottom: 24 }}>
        <div className="nd-peluang-filter" role="tablist">
          {PROMO_FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`nd-peluang-filter__btn${filter === f.id ? " is-active" : ""}`}
            >
              <span aria-hidden="true">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Daftar promo" style={{ marginBottom: 40 }}>
        {visiblePromos.length === 0 ? (
          <div className="nd-promo-empty">
            <span aria-hidden="true">🎁</span>
            <p>Belum ada promo untuk kategori ini.</p>
          </div>
        ) : (
          <div className="nd-promo-grid">
            {visiblePromos.map((promo) => (
              <article key={promo.id} className="nd-promo-card">
                <div className="nd-promo-card__badge">
                  {promo.diskon > 0 ? `-${promo.diskon}%` : "GRATIS"}
                </div>

                <div className="nd-promo-card__icon" aria-hidden="true">
                  🎁
                </div>

                <h3 className="nd-promo-card__title">{promo.title}</h3>
                <p className="nd-promo-card__desc">{promo.desc}</p>

                <div className="nd-promo-card__meta">
                  <span>Min. {formatRp(promo.minBelanja)}</span>
                  <span>s/d {promo.berlakuSampai}</span>
                </div>

                <div className="nd-promo-card__code">
                  <code>{promo.code}</code>
                  <button
                    type="button"
                    onClick={() => copyCode(promo.code)}
                    className="nd-promo-card__copy"
                  >
                    {copied === promo.code ? "✅ Tersalin" : "Salin"}
                  </button>
                </div>

                <a href="/search" className="nd-promo-card__cta">
                  Belanja Sekarang →
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}