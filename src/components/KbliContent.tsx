"use client";

import { useMemo, useState } from "react";
import { CounterStat } from "@/components/CounterStat";

export type KbliCategory = {
  code: string;
  icon: string;
  title: string;
  description: string;
  examples: string[];
  accent?: "red" | "green" | "amber";
};

export function KbliContent({
  categories,
}: {
  categories: KbliCategory[];
}) {
  const [query, setQuery] = useState("");
  const [activeCode, setActiveCode] = useState<string>("all");
  const [detail, setDetail] = useState<KbliCategory | null>(null);

  const totalExamples = useMemo(
    () => categories.reduce((sum, c) => sum + c.examples.length, 0),
    [categories]
  );

  const visibleCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter((c) => {
      if (activeCode !== "all" && c.code !== activeCode) return false;
      if (!q) return true;
      return (
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.examples.some((e) => e.toLowerCase().includes(q))
      );
    });
  }, [categories, query, activeCode]);

  return (
    <>
      {/* ===== Counter ===== */}
      <section aria-label="Statistik KBLI" style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
          }}
        >
          <CounterStat value={categories.length} label="Kategori Utama" icon="📊" />
          <CounterStat value={totalExamples} label="Contoh Kegiatan" icon="🏭" />
          <CounterStat value={27} label="Referensi OSS" icon="🔗" />
        </div>
      </section>

      {/* ===== Search ===== */}
      <section aria-label="Cari KBLI" style={{ marginBottom: 20 }}>
        <div className="nd-kbli-search">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kode, nama, atau contoh kegiatan KBLI..."
            aria-label="Cari KBLI"
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

      {/* ===== Filter ===== */}
      <section aria-label="Filter kategori" style={{ marginBottom: 24 }}>
        <div className="nd-peluang-filter" role="tablist">
          <button
            role="tab"
            type="button"
            aria-selected={activeCode === "all"}
            onClick={() => setActiveCode("all")}
            className={`nd-peluang-filter__btn${activeCode === "all" ? " is-active" : ""}`}
          >
            <span aria-hidden="true">🎯</span> Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.code}
              role="tab"
              type="button"
              aria-selected={activeCode === c.code}
              onClick={() => setActiveCode(c.code)}
              className={`nd-peluang-filter__btn${activeCode === c.code ? " is-active" : ""}`}
            >
              <span aria-hidden="true">{c.icon}</span> {c.code}
            </button>
          ))}
        </div>
      </section>

      {/* ===== Grid Kategori ===== */}
      <section aria-label="Daftar kategori" style={{ marginBottom: 40 }}>
        {visibleCategories.length === 0 ? (
          <div className="nd-promo-empty">
            <span aria-hidden="true">🔎</span>
            <p>Tidak ada kategori yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="nd-kbli-grid">
            {visibleCategories.map((c) => (
              <article
                key={c.code}
                className={`nd-kbli-card nd-kbli-card--${c.accent ?? "red"}`}
              >
                <div className="nd-kbli-card__head">
                  <span className="nd-kbli-card__icon" aria-hidden="true">
                    {c.icon}
                  </span>
                  <span className="nd-kbli-card__code">{c.code}</span>
                </div>
                <h3 className="nd-kbli-card__title">{c.title}</h3>
                <p className="nd-kbli-card__desc">{c.description}</p>

                <ul className="nd-kbli-card__examples">
                  {c.examples.slice(0, 3).map((ex) => (
                    <li key={ex}>{ex}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="nd-kbli-card__btn"
                  onClick={() => setDetail(c)}
                >
                  Lihat Detail →
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ===== Modal Detail ===== */}
      {detail && (
        <div
          className="nd-modal-backdrop"
          onClick={() => setDetail(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="nd-kbli-modal-title"
        >
          <div className="nd-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="nd-modal__close"
              onClick={() => setDetail(null)}
              aria-label="Tutup"
            >
              ✕
            </button>

            <div className="nd-modal__header">
              <span className="nd-modal__icon" aria-hidden="true">
                {detail.icon}
              </span>
              <div>
                <span className="nd-modal__code">KBLI {detail.code}</span>
                <h3 id="nd-kbli-modal-title" className="nd-modal__title">
                  {detail.title}
                </h3>
              </div>
            </div>

            <p className="nd-modal__desc">{detail.description}</p>

            <h4 className="nd-modal__subtitle">Contoh kegiatan usaha</h4>
            <ul className="nd-modal__list">
              {detail.examples.map((ex) => (
                <li key={ex}>
                  <span aria-hidden="true">✓</span> {ex}
                </li>
              ))}
            </ul>

            <a
              href="https://oss.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="nd-modal__cta"
            >
              Cek di OSS ↗
            </a>
          </div>
        </div>
      )}
    </>
  );
}