"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAvailableRoutes, claimRoute, type CourierRoute } from "@/lib/courier-api";

const FEE_PER_ORDER = 5000;
const PLATFORM_FEE_PERCENT = 5;

function calculateFee(route: CourierRoute) {
  const totalOrderFee = route.customers * FEE_PER_ORDER;
  const gross = Number(route.fee) + totalOrderFee;
  const platformFee = Math.round((gross * PLATFORM_FEE_PERCENT) / 100);
  const net = gross - platformFee;
  return { totalOrderFee, gross, platformFee, net };
}

export default function CourierDashboardPage() {
  const [routes, setRoutes] = useState<CourierRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimedRoutes, setClaimedRoutes] = useState<string[]>([]);

  useEffect(() => {
    getAvailableRoutes().then((data) => {
      setRoutes(data);
      setLoading(false);
    });
  }, []);

  const handleClaim = async (routeId: number, routeCode: string) => {
    const res = await claimRoute(routeId, "kurir-demo-001");
    if (res.success) {
      alert(`✅ Rute ${routeCode} berhasil diambil!`);
      setClaimedRoutes([...claimedRoutes, routeCode]);
      setRoutes(routes.filter((r) => r.id !== routeId));
    } else {
      alert(`❌ ${res.message}`);
    }
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

        {loading ? (
          <div className="mt-6 text-center text-gray-500">Memuat rute...</div>
        ) : routes.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-gray-50 p-6 text-center text-gray-500">
            Belum ada rute tersedia. Cek lagi nanti.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {routes.map((route) => {
              const isClaimed = claimedRoutes.includes(route.route_code);
              const fee = calculateFee(route);
              return (
                <div key={route.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Rute {route.route_code} — {route.area}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {route.customers} pelanggan · {route.weight_kg} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-red-600">Rp{fee.net.toLocaleString("id-ID")}</p>
                      <p className="text-xs text-gray-400">estimasi fee bersih</p>
                    </div>
                  </div>

                  {/* Rincian Fee */}
                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">RINCIAN PREDIKSI FEE</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fee dasar rute</span>
                        <span className="font-semibold">Rp{Number(route.fee).toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fee per pesanan ({route.customers}x)</span>
                        <span className="font-semibold">Rp{fee.totalOrderFee.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                        <span className="text-gray-600">Total kotor</span>
                        <span className="font-semibold">Rp{fee.gross.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Potongan platform ({PLATFORM_FEE_PERCENT}%)</span>
                        <span>-Rp{fee.platformFee.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-1 mt-1 text-base font-bold">
                        <span>Fee bersih diterima</span>
                        <span className="text-green-700">Rp{fee.net.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    {isClaimed ? (
                      <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                        ✅ Rute sudah diambil. Cek di halaman Rute Aktif.
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaim(route.id, route.route_code)}
                        className="w-full rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
                      >
                        Ambil Rute {route.route_code} →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
