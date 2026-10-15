"use client";

import { useState } from "react";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function KalkulatorProfit() {
  const [hargaBeli, setHargaBeli] = useState(50000);
  const [hargaJual, setHargaJual] = useState(75000);
  const [target, setTarget] = useState(100);

  const margin = Math.max(0, hargaJual - hargaBeli);
  const profit = margin * target;
  const profitTahun = profit * 12;

  return (
    <div className="nd-kalkulator">
      <div className="nd-kalkulator__header">
        <span aria-hidden="true">🧮</span>
        <div>
          <h3>Kalkulator Estimasi Profit</h3>
          <p>Hitung potensi keuntungan usahamu</p>
        </div>
      </div>

      <div className="nd-kalkulator__body">
        <div className="nd-kalkulator__input">
          <label>Harga beli (Rp)</label>
          <input
            type="number"
            value={hargaBeli}
            onChange={(e) => setHargaBeli(Number(e.target.value) || 0)}
            min={0}
          />
        </div>

        <div className="nd-kalkulator__input">
          <label>Harga jual (Rp)</label>
          <input
            type="number"
            value={hargaJual}
            onChange={(e) => setHargaJual(Number(e.target.value) || 0)}
            min={0}
          />
        </div>

        <div className="nd-kalkulator__input">
          <label>Target penjualan / bulan</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value) || 0)}
            min={0}
          />
        </div>

        <div className="nd-kalkulator__result">
          <div className="nd-kalkulator__row">
            <span>Margin per unit</span>
            <strong>{formatRp(margin)}</strong>
          </div>
          <div className="nd-kalkulator__row">
            <span>Profit / bulan</span>
            <strong className="nd-kalkulator__big">{formatRp(profit)}</strong>
          </div>
          <div className="nd-kalkulator__row">
            <span>Estimasi / tahun</span>
            <strong>{formatRp(profitTahun)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}