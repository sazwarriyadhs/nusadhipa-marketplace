"use client";

import { useState } from "react";
import Link from "next/link";

export default function CourierRegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    vehicle_type: "motor", plate_number: "",
    city: "", payout_method: "bank",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pendaftaran berhasil! Tim NUSA-DHIPA akan verifikasi dalam 1x24 jam.");
  };

  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/courier" className="text-sm text-red-600 hover:underline">
        ← Kembali
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Daftar Jadi Kurir</h1>
      <p className="mt-2 text-gray-600">
        Isi data diri kamu. Tim NUSA-DHIPA akan verifikasi dalam 1x24 jam.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="Nama sesuai KTP" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Nomor HP</label>
          <input type="tel" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="08xxxxxxxxxx" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="email@example.com" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Domisili (Kota)</label>
          <input type="text" required value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="Kota Bogor" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Jenis Kendaraan</label>
          <select required value={form.vehicle_type} onChange={(e) => setForm({...form, vehicle_type: e.target.value})} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3">
            <option value="motor">Motor</option>
            <option value="mobil">Mobil</option>
            <option value="sepeda">Sepeda</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Plat Nomor</label>
          <input type="text" required value={form.plate_number} onChange={(e) => setForm({...form, plate_number: e.target.value})} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="F 1234 AB" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Upload KTP</label>
          <input type="file" accept="image/*" required className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Upload SIM (opsional)</label>
          <input type="file" accept="image/*" className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Metode Pencairan</label>
          <select value={form.payout_method} onChange={(e) => setForm({...form, payout_method: e.target.value})} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3">
            <option value="bank">Transfer Bank</option>
            <option value="ewallet">E-Wallet (GoPay/OVO/Dana)</option>
          </select>
        </div>

        <button type="submit" className="w-full rounded-xl bg-red-600 px-6 py-4 font-bold text-white hover:bg-red-700">
          Kirim Pendaftaran
        </button>
      </form>
    </main>
  );
}
