"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getEarnings, type CourierEarning } from "@/lib/courier-api";

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<CourierEarning[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const courierId = "kurir-demo-001";

  useEffect(() => {
    getEarnings(courierId).then((res) => {
      setEarnings(res?.data ?? []);
      setSummary(res?.summary ?? {});
      setLoading(false);
    });
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/courier/dashboard" className="text-sm text-red-600 hover:underline">← Kembali</Link>
      <h1 className="mt-4 text-2xl font-bold">Pendapatan Saya</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-green-600 p-6 text-white">
          <p className="text-sm opacity-80">Saldo Tersedia</p>
          <p className="mt-2 text-2xl font-black">Rp{Number(summary.available_balance || 0).toLocaleString("id-ID")}</p>
        </div>
        <div className="rounded-2xl bg-yellow-500 p-6 text-white">
          <p className="text-sm opacity-80">Saldo Tertunda</p>
          <p className="mt-2 text-2xl font-black">Rp{Number(summary.pending_balance || 0).toLocaleString("id-ID")}</p>
        </div>
        <div className="rounded-2xl bg-gray-800 p-6 text-white">
          <p className="text-sm opacity-80">Total Dicairkan</p>
          <p className="mt-2 text-2xl font-black">Rp{Number(summary.total_paid || 0).toLocaleString("id-ID")}</p>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-bold">Riwayat Transaksi</h2>
      {loading ? <p className="mt-4 text-gray-500">Memuat...</p> : earnings.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-gray-50 p-6 text-center text-gray-500">Belum ada pendapatan.</div>
      ) : (
        <div className="mt-4 space-y-3">
          {earnings.map((e) => (
            <div key={e.id} className="rounded-xl border border-gray-200 bg-white p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">Rute {e.route_code ?? e.route_id} — {e.area ?? ""}</p>
                <p className="text-xs text-gray-500">{new Date(e.created_at).toLocaleString("id-ID")}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-700">+Rp{Number(e.amount).toLocaleString("id-ID")}</p>
                <p className="text-xs text-gray-500 capitalize">{e.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
