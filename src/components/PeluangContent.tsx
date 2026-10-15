"use client";

import { useMemo, useState } from "react";
import { CounterStat } from "@/components/CounterStat";
import { KalkulatorProfit } from "@/components/KalkulatorProfit";
import { PeluangFilter, type FilterId } from "@/components/PeluangFilter";
import type { Product } from "@/lib/marketplace-api";

export function PeluangContent({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<FilterId>("all");

  const stats = useMemo(() => {
    const sellers = new Set(
      products.map((p) => p.business_name).filter(Boolean)
    );
    const categories = new Set(
      products.map((p) => p.category_name).filter(Boolean)
    );
    return {
      totalProducts: products.length,
      totalSellers: sellers.size,
      totalCategories: categories.size,
    };
  }, [products]);

  return (
    <>
      {/* ===== Counter Statistik ===== */}
      <section
        aria-label="Statistik ekosistem"
        style={{ marginBottom: 32 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
          }}
        >
          <CounterStat
            value={stats.totalProducts}
            label="Produk Aktif"
            icon="📦"
          />
          <CounterStat
            value={stats.totalSellers}
            label="Mitra Usaha"
            icon="🤝"
          />
          <CounterStat
            value={stats.totalCategories}
            label="Kategori Usaha"
            icon="🏪"
          />
        </div>
      </section>

      {/* ===== Filter Jenis Peluang ===== */}
      <section
        aria-label="Filter jenis peluang"
        style={{ marginBottom: 32 }}
      >
        <PeluangFilter active={filter} onChange={setFilter} />
      </section>

      {/* ===== Kalkulator Profit ===== */}
      <section
        aria-label="Kalkulator estimasi profit"
        style={{ marginBottom: 40 }}
      >
        <KalkulatorProfit />
      </section>
    </>
  );
}