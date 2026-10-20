"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyRoutes, completeRoute, type CourierRoute } from "@/lib/courier-api";

export default function MyRoutesPage() {
  const [routes, setRoutes] = useState<CourierRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const courierId = "kurir-demo-001";

  useEffect(() => {
    getMyRoutes(courierId).then((data) => { setRoutes(data); setLoading(false); });
  }, []);

  const handleComplete = async (id: number) => {
    const res = await completeRoute(id, courierId);
    if (res.success) {
      alert("✅ Rute selesai! Fee masuk ke saldo.");
      setRoutes(routes.filter(r => r.id !== id));
    } else {
      alert("❌ " + res.message);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/courier/dashboard" className="text-sm text-red-600 hover:underline">← Kembali</Link>
      <h1 className="mt-4 text-2xl font-bold">Rute Aktif Saya</h1>
      {loading ? <p className="mt-4 text-gray-500">Memuat...</p> : routes.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-gray-50 p-6 text-center text-gray-500">Belum ada rute aktif. Ambil rute di Dashboard.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {routes.map((r) => (
            <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-lg font-bold">Rute {r.route_code} — {r.area}</h3>
              <p className="text-sm text-gray-600">{r.customers} pelanggan · {r.weight_kg} kg · Fee Rp{Number(r.fee).toLocaleString("id-ID")}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleComplete(r.id)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">Selesaikan Rute</button>
                <Link href={`/courier/routes/${r.route_code}`} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">Lihat Detail</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
