"use client";
import Link from "next/link";

export default function CourierProfilePage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <Link href="/courier/dashboard" className="text-sm text-red-600 hover:underline">← Kembali</Link>
      <h1 className="mt-4 text-2xl font-bold">Profil Kurir</h1>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-2xl">👤</div>
          <div>
            <h2 className="text-lg font-bold">Kurir Demo</h2>
            <p className="text-sm text-gray-500">kurir-demo-001</p>
            <p className="text-xs text-green-600 font-semibold">✅ Terverifikasi</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Kendaraan</span><span className="font-semibold">Motor</span></div>
          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Plat Nomor</span><span className="font-semibold">F 1234 AB</span></div>
          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Domisili</span><span className="font-semibold">Kota Bogor</span></div>
          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Metode Pencairan</span><span className="font-semibold">Transfer Bank (BCA)</span></div>
          <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">No. Rekening</span><span className="font-semibold">**** 5678</span></div>
        </div>

        <button className="mt-6 w-full rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700">
          Ajukan Pencairan
        </button>
      </div>
    </main>
  );
}
