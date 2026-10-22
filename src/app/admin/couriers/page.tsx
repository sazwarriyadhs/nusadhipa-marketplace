"use client";

import { getToken } from "@/lib/auth-api";

import { useEffect, useState } from "react";

type Courier = {
  id: number;
  public_id: string;
  name: string;
  email: string;
  phone: string | null;
  vehicle_type: string | null;
  plate_number: string | null;
  city: string | null;
  status: "pending" | "approved" | "rejected" | "suspended";
  created_at: string;
};

export default function AdminCouriersPage() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCouriers = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Sesi login tidak ditemukan. Login sebagai superadmin.");
      const res = await fetch("https://api.nusadhipa.shop/api/v1/courier/admin/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCouriers(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Sesi login tidak ditemukan. Silakan login kembali.");
        return;
      }

      const res = await fetch(
        `https://api.nusadhipa.shop/api/v1/courier/admin/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`Kurir berhasil diperbarui: ${status}`);
        fetchCouriers();
      } else {
        alert(data.message || `Gagal memperbarui kurir (HTTP ${res.status})`);
      }
    } catch (error) {
      console.error("Gagal memperbarui status kurir:", error);
      alert("Terjadi kesalahan saat memperbarui status kurir.");
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-2xl font-bold">Admin — Verifikasi Kurir</h1>
      <p className="mt-1 text-sm text-gray-600">Setujui atau tolak pendaftaran kurir baru.</p>

      {loading ? (
        <p className="mt-6 text-gray-500">Memuat...</p>
      ) : couriers.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-gray-50 p-6 text-center text-gray-500">Belum ada kurir terdaftar.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {couriers.map((c) => (
            <div key={c.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">{c.name}</h3>
                  <p className="text-sm text-gray-600">{c.email} · {c.phone ?? "-"}</p>
                  <p className="text-sm text-gray-600">{c.vehicle_type ?? "-"} · {c.plate_number ?? "-"} · {c.city ?? "-"}</p>
                  <p className="text-xs text-gray-400 mt-1">Daftar: {new Date(c.created_at).toLocaleString("id-ID")}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    c.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    c.status === "approved" ? "bg-green-100 text-green-700" :
                    c.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
              {c.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => updateStatus(c.id, "approved")} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">Approve</button>
                  <button onClick={() => updateStatus(c.id, "rejected")} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
