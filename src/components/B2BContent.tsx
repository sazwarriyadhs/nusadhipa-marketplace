"use client";

import { useMemo, useState } from "react";
import { CounterStat } from "@/components/CounterStat";
import type { Product } from "@/lib/marketplace-api";

export function B2BContent({ products }: { products: Product[] }) {
  const [nama, setNama] = useState("");
  const [produk, setProduk] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [wa, setWa] = useState("");
  const [sent, setSent] = useState(false);

  const stats = useMemo(() => {
    const sellers = new Set(
      products.map((p) => p.business_name).filter(Boolean)
    );
    const categories = new Set(
      products.map((p) => p.category_name).filter(Boolean)
    );
    const minPrice = products.reduce((min, p) => {
      const price = Number(p.min_price);
      return Number.isFinite(price) && price > 0 && price < min ? price : min;
    }, Infinity);
    return {
      totalProducts: products.length,
      totalSellers: sellers.size,
      totalCategories: categories.size,
      minPrice: Number.isFinite(minPrice) ? minPrice : 0,
    };
  }, [products]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama || !produk || !jumlah || !wa) return;

    const message = encodeURIComponent(
      `Halo, saya ${nama}.\n\n` +
      `Saya ingin request quote untuk:\n` +
      `• Produk: ${produk}\n` +
      `• Jumlah: ${jumlah}\n\n` +
      `Mohon info harga grosir & ketersediaan.\n` +
      `Terima kasih.`
    );

    // Arahkan ke WhatsApp (placeholder nomor — ganti sesuai kebutuhan)
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <>
      {/* ===== Counter Statistik ===== */}
      <section aria-label="Statistik B2B" style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
          }}
        >
          <CounterStat value={stats.totalProducts} label="Produk Grosir" icon="📦" />
          <CounterStat value={stats.totalSellers} label="Supplier" icon="🏭" />
          <CounterStat value={stats.totalCategories} label="Kategori" icon="📊" />
          <CounterStat
            value={stats.minPrice}
            label="Harga Mulai"
            icon="💰"
            suffix=""
          />
        </div>
      </section>

      {/* ===== Form RFQ ===== */}
      <section aria-label="Form request quote" style={{ marginBottom: 40 }}>
        <div className="nd-b2b-rfq">
          <div className="nd-b2b-rfq__header">
            <span aria-hidden="true">📋</span>
            <div>
              <h3>Request for Quote (RFQ)</h3>
              <p>Minta penawaran harga grosir langsung ke supplier</p>
            </div>
          </div>

          <form className="nd-b2b-rfq__form" onSubmit={handleSubmit}>
            <div className="nd-b2b-rfq__grid">
              <div className="nd-b2b-rfq__field">
                <label>Nama Anda</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  required
                />
              </div>
              <div className="nd-b2b-rfq__field">
                <label>Produk yang dicari</label>
                <input
                  type="text"
                  value={produk}
                  onChange={(e) => setProduk(e.target.value)}
                  placeholder="Contoh: Tuna Loin Beku"
                  required
                />
              </div>
              <div className="nd-b2b-rfq__field">
                <label>Jumlah</label>
                <input
                  type="text"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  placeholder="Contoh: 100 kg"
                  required
                />
              </div>
              <div className="nd-b2b-rfq__field">
                <label>WhatsApp</label>
                <input
                  type="tel"
                  value={wa}
                  onChange={(e) => setWa(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  required
                />
              </div>
            </div>

            <button type="submit" className="nd-b2b-rfq__btn">
              {sent ? "✅ Terkirim!" : "Kirim Permintaan →"}
            </button>

            <p className="nd-b2b-rfq__note">
              Permintaan akan diteruskan ke supplier terkait via WhatsApp.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}