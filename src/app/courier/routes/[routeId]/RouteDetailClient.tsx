"use client";

import Link from "next/link";
import { useState } from "react";

type Order = {
  id: string;
  tenant: string;
  customer: string;
  address: string;
  status: "pending" | "picked_up" | "delivered" | "received";
};

// Tenant resmi NUSA-DHIPA (bisa diambil dari API GET /businesses nanti)
const NUSA_DHIPA_TENANTS = [
  "Fajar Florist",
  "PT SAURI",
  "PT DIGI MEDIA KOMUNIKA",
  "Fresh Market Unggas",
];

const SAMPLE_ORDERS: Order[] = [
  { id: "ORD-001", tenant: "Fajar Florist", customer: "Budi Santoso", address: "Jl. Pajajaran No. 12, Bogor Timur", status: "pending" },
  { id: "ORD-002", tenant: "PT SAURI", customer: "Siti Aminah", address: "Jl. Sukasari No. 5, Bogor Timur", status: "pending" },
  { id: "ORD-003", tenant: "PT DIGI MEDIA KOMUNIKA", customer: "Andi Wijaya", address: "Jl. Baranangsiang No. 8, Bogor Timur", status: "pending" },
  { id: "ORD-004", tenant: "Fajar Florist", customer: "Dewi Lestari", address: "Jl. Paledang No. 3, Bogor Timur", status: "pending" },
];

const STATUS_LABELS = {
  pending: "Belum Diambil",
  picked_up: "Sudah Diambil",
  delivered: "Sudah Diantar",
  received: "Diterima",
};

export default function RouteDetailClient({ routeId }: { routeId: string }) {
  const [orders, setOrders] = useState<Order[]>(
    SAMPLE_ORDERS.filter((o) => NUSA_DHIPA_TENANTS.includes(o.tenant))
  );

  const updateStatus = (id: string, status: Order["status"]) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const allReceived = orders.every((o) => o.status === "received");

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/courier/dashboard" className="text-sm text-red-600 hover:underline">
        ← Kembali ke Dashboard
      </Link>

      <div className="mt-4 flex items-center gap-2">
        <img src="/logos/courier-truck.png" alt="Kurir" className="h-10 w-10" />
        <h1 className="text-2xl font-bold text-gray-900">Rute {routeId} — Bogor Timur</h1>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {orders.length} pesanan dari tenant resmi NUSA-DHIPA · Total 18 kg
      </p>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-gray-500">{order.id}</p>
                <h3 className="mt-1 text-lg font-bold text-gray-900">
                  {order.tenant} → {order.customer}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{order.address}</p>
                <p className="mt-1 text-xs font-semibold text-green-600">✅ Tenant Resmi NUSA-DHIPA</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                order.status === "picked_up" ? "bg-blue-100 text-blue-700" :
                order.status === "delivered" ? "bg-purple-100 text-purple-700" :
                "bg-green-100 text-green-700"
              }`}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {order.status === "pending" && (
                <button onClick={() => updateStatus(order.id, "picked_up")} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Ambil Barang dari {order.tenant}
                </button>
              )}
              {order.status === "picked_up" && (
                <button onClick={() => updateStatus(order.id, "delivered")} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">
                  Konfirmasi Terkirim ke {order.customer}
                </button>
              )}
              {order.status === "delivered" && (
                <button onClick={() => updateStatus(order.id, "received")} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                  Selesai (Diterima)
                </button>
              )}
              {order.status === "received" && (
                <span className="rounded-lg bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">✅ Selesai</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {allReceived && (
        <div className="mt-8 rounded-2xl bg-green-50 p-6 text-center">
          <p className="text-lg font-bold text-green-800">🎉 Rute Selesai!</p>
          <p className="mt-1 text-sm text-green-700">Fee rute akan masuk ke saldo setelah diverifikasi.</p>
          <Link href="/courier/earnings" className="mt-4 inline-block rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700">
            Lihat Pendapatan
          </Link>
        </div>
      )}
    </main>
  );
}
