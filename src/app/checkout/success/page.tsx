"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Baca data order dari sessionStorage
    try {
      const stored = sessionStorage.getItem("last_order");
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    } catch {}
  }, []);

  return (
    <main className="nd-content checkout-success-page">
      <div className="checkout-success-card">
        {/* ===== ICON SUKSES ===== */}
        <div className="checkout-success-icon">✅</div>

        <h1 className="checkout-success-title">Pesanan Berhasil Dibuat!</h1>
        <p className="checkout-success-subtitle">
          Terima kasih telah berbelanja di NUSA-DHIPA Marketplace
        </p>

        {orderData && (
          <div className="checkout-success-detail">
            <div className="checkout-success-row">
              <span>No. Pesanan</span>
              <strong>{orderData.order_number}</strong>
            </div>
            <div className="checkout-success-row">
              <span>Total Pembayaran</span>
              <strong className="checkout-success-total">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(orderData.grand_total)}
              </strong>
            </div>
            <div className="checkout-success-row">
              <span>Status</span>
              <span className="checkout-success-badge">Menunggu Pembayaran</span>
            </div>
          </div>
        )}

        {/* ===== INFO ===== */}
        <div className="checkout-success-info">
          <div className="checkout-success-info-item">
            <span className="checkout-success-info-icon">📱</span>
            <div>
              <strong>Konfirmasi via WhatsApp</strong>
              <p>Penjual akan menghubungi kamu via WhatsApp untuk konfirmasi pesanan.</p>
            </div>
          </div>
          <div className="checkout-success-info-item">
            <span className="checkout-success-info-icon">📦</span>
            <div>
              <strong>Estimasi Pengiriman</strong>
              <p>2-4 hari kerja setelah pembayaran dikonfirmasi.</p>
            </div>
          </div>
          <div className="checkout-success-info-item">
            <span className="checkout-success-info-icon">💰</span>
            <div>
              <strong>Pembayaran Aman</strong>
              <p>Transfer ke rekening penjual atau pilih metode pembayaran.</p>
            </div>
          </div>
        </div>

        {/* ===== AKSI ===== */}
        <div className="checkout-success-actions">
          <Link href="/pesanan" className="checkout-success-btn checkout-success-btn--primary">
            Lihat Pesanan Saya
          </Link>
          <Link href="/search" className="checkout-success-btn">
            Lanjut Belanja
          </Link>
        </div>
      </div>
    </main>
  );
}