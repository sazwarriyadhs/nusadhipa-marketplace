"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDeliveries, type CourierRoute } from "@/lib/courier-api";

export default function DeliveriesPage() {
  const [routes, setRoutes] = useState<CourierRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const courierId = "kurir-demo-001";

  useEffect(() => {
    getDeliveries(courierId).then((data) => { setRoutes(data); setLoading(false); });
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/courier/dashboard" className="text-sm text-red-600 hover:underline">← Kembali</Link>
      <h1 className="mt-4 text-2xl font-bold">Riwayat Pengiriman</h1>
      {loading ? <p className="mt-4 text-gray-500">Memuat...</p> : routes.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-gray-50 p-6 text-center text-gray-500">Belum ada riwayat pengiriman.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {routes.map((r) => (
            <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-bold">Rute {r.route_code} — {r.area}</h3>
                  <p className="text-sm text-gray-600">{r.customers} pelanggan · {r.weight_kg} kg</p>
                  <p className="text-xs text-gray-400 mt-1">Selesai: {r.completed_at ? new Date(r.completed_at).toLocaleString("id-ID") : "-"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">Rp{Number(r.fee).toLocaleString("id-ID")}</p>
                  <p className="text-xs text-gray-500">fee rute</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
