"use client";

import { useState } from "react";
import Link from "next/link";

export default function CourierLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://api.nusadhipa.shop/api/v1/courier/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("courier_token", data.token);
        localStorage.setItem("courier_id", data.courier.public_id);
        localStorage.setItem("courier_name", data.courier.name);
        alert("✅ Login berhasil!");
        window.location.href = "/courier/dashboard";
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <Link href="/courier" className="text-sm text-red-600 hover:underline">← Kembali</Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Login Kurir</h1>
      <p className="mt-2 text-gray-600">Masuk ke dashboard kurir NUSA-DHIPA.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="email@example.com" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-red-600 px-6 py-4 font-bold text-white hover:bg-red-700 disabled:opacity-50">
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Belum punya akun?{" "}
        <Link href="/courier/register" className="text-red-600 hover:underline">
          Daftar di sini
        </Link>
      </p>
    </main>
  );
}
