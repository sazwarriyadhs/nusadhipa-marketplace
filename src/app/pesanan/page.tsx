"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/marketplace-api";

type Order = {
  public_id: string;
  order_number: string;
  status: string;
  currency: string;
  grand_total: number;
  buyer_name: string;
  placed_at: string;
  items_count: number;
  shipping_distance_km?: number;
};

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function statusLabel(s: string) {
  switch (s) {
    case "pending_payment": return "Menunggu Bayar";
    case "paid": return "Dibayar";
    case "processing": return "Diproses";
    case "shipped": return "Dikirim";
    case "completed": return "Selesai";
    case "cancelled": return "Batal";
    case "refunded": return "Refund";
    default: return s;
  }
}

function statusColor(s: string) {
  switch (s) {
    case "pending_payment": return "#b91c2c";
    case "paid": return "#16a34a";
    case "processing": return "#d97706";
    case "shipped": return "#0369a1";
    case "completed": return "#16a34a";
    case "cancelled":
    case "refunded": return "#777782";
    default: return "#777782";
  }
}

export default function PesananPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/orders`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setOrders(json.data || []);
      } else {
        setError("Gagal memuat pesanan.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <main className="nd-content pesanan-page">
      <div className="pesanan-header">
        <div>
          <h1>Pesanan Saya</h1>
          <p>Pantau status pesanan kamu di sini</p>
        </div>
        <button type="button" onClick={loadOrders} className="pesanan-refresh">
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="pesanan-state">
          <div className="pesanan-spinner" />
          <p>Memuat pesanan...</p>
        </div>
      ) : error ? (
        <div className="pesanan-state">
          <span style={{ fontSize: "3rem" }}>⚠️</span>
          <h3>Gagal memuat</h3>
          <p>{error}</p>
          <button type="button" onClick={loadOrders} className="pesanan-btn">
            Coba lagi
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="pesanan-state">
          <span style={{ fontSize: "3rem" }}>📭</span>
          <h3>Belum ada pesanan</h3>
          <p>Yuk mulai belanja di NUSA-DHIPA Marketplace.</p>
          <Link href="/search" className="pesanan-btn">
            Jelajahi Produk
          </Link>
        </div>
      ) : (
        <div className="pesanan-list">
          {orders.map((order) => (
            <Link
              key={order.public_id}
              href={`/pesanan/${order.public_id}`}
              className="pesanan-card"
            >
              <div className="pesanan-card-head">
                <strong>{order.order_number}</strong>
                <span
                  className="pesanan-status"
                  style={{
                    color: statusColor(order.status),
                    background: `${statusColor(order.status)}15`,
                    borderColor: `${statusColor(order.status)}40`,
                  }}
                >
                  {statusLabel(order.status)}
                </span>
              </div>
              <div className="pesanan-card-body">
                <div className="pesanan-card-row">
                  <span>👤 {order.buyer_name}</span>
                  <span>📦 {order.items_count} item</span>
                </div>
                <div className="pesanan-card-row">
                  <span>🗓️ {formatDate(order.placed_at)}</span>
                </div>
                <div className="pesanan-card-total">
                  <span>Total</span>
                  <strong>{rupiah(order.grand_total)}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}