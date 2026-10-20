"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type Route = {
  code: string;
  area: string;
  customers: number;
  weight_kg: number;
  fee: number;
};

const AVAILABLE_ROUTES: Route[] = [
  { code: "A", area: "Bogor Timur", customers: 4, weight_kg: 18, fee: 25000 },
  { code: "B", area: "Baranangsiang", customers: 5, weight_kg: 22, fee: 36000 },
  { code: "C", area: "Bogor Utara", customers: 3, weight_kg: 12, fee: 20000 },
];

export default function CourierDashboardPage() {
  const [claimedRoutes, setClaimedRoutes] = useState<string[]>([]);

  const handleClaim = (code: string) => {
    setClaimedRoutes([...claimedRoutes, code]);
    alert(`Rute ${code} berhasil diambil! (simulasi)`);
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-center gap-4">
        <Image src="/logos/courier-motor.png" alt="Kurir" width={64} height={64} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Kurir</h1>
          <p className="text-sm text-gray-600">Selamat datang, Kurir NUSA-DHIPA!</p>
        </div>
      </div>

      {/* Statistik */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-6 text-white">
          <p className="text-sm opacity-80">Penghasilan Hari Ini</p>
          <p className="mt-2 text-3xl font-black">Rp86.000</p>
          <p className="mt-1 text-xs opacity-70">*simulasi</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Rute Selesai</p>
          <p className="mt-2 text-3xl font-black text-gray-900">3</p>
          <p className="mt-1 text-xs text-gray-400">hari ini</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">Total Pesanan</p>
          <p className="mt-2 text-3xl font-black text-gray-900">12</p>
          <p className="mt-1 text-xs text-gray-400">lintas tenant</p>
        </div>
      </div>

      {/* Rute Tersedia */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900">Rute Tersedia</h2>
        <p className="mt-1 text-sm text-gray-600">Pilih rute yang sesuai kapasitas dan lokasi kamu.</p>

        <div className="mt-4 space-y-4">
          {AVAILABLE_ROUTES.map((route) => {
            const isClaimed = claimedRoutes.includes(route.code);
            return (
              <div key={route.code} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Rute {route.code} — {route.area}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {route.customers} pelanggan · {route.weight_kg} kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-red-600">Rp{route.fee.toLocaleString("id-ID")}</p>
                    <p className="text-xs text-gray-400">fee rute</p>
                  </div>
                </div>
                <div className="mt-4">
                  {isClaimed ? (
                    <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                      ✅ Rute sudah diambil. Cek di halaman Rute Aktif.
                    </div>
                  ) : (
                    <button
                      onClick={() => handleClaim(route.code)}
                      className="w-full rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
                    >
                      Ambil Rute {route.code} →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigasi */}
      <div className="mt-10 grid gap-3 sm:grid-cols-4">
        <Link href="/courier/routes" className="rounded-xl border border-gray-200 bg-white p-4 text-center text-sm font-semibold hover:bg-gray-50">
          📍 Rute Aktif
        </Link>
        <Link href="/courier/deliveries" className="rounded-xl border border-gray-200 bg-white p-4 text-center text-sm font-semibold hover:bg-gray-50">
          📦 Riwayat
        </Link>
        <Link href="/courier/earnings" className="rounded-xl border border-gray-200 bg-white p-4 text-center text-sm font-semibold hover:bg-gray-50">
          💰 Pendapatan
        </Link>
        <Link href="/courier/profile" className="rounded-xl border border-gray-200 bg-white p-4 text-center text-sm font-semibold hover:bg-gray-50">
          👤 Profil
        </Link>
      </div>
    </main>
  );
}
