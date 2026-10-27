"use client";

import { useState } from "react";

export function AddProductModal({ businessId, onClose }: { businessId: number; onClose: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("nd_auth_token");
      if (!token) throw new Error("Anda belum login");

      const formData = new FormData();
      formData.append("business_id", businessId.toString());
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("description", description);
      if (image) formData.append("image", image);

      const res = await fetch(`${process.env.NEXT_PUBLIC_MARKETPLACE_API_URL}/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert("Produk berhasil ditambahkan!");
        onClose();
        window.location.reload();
      } else {
        const err = await res.json();
        throw new Error(err.message || "Gagal menambahkan produk");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "white", padding: "2rem", borderRadius: "12px",
        width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto"
      }}>
        <h2 style={{ marginBottom: "1rem" }}>Tambah Produk</h2>
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          <input type="text" placeholder="Nama Produk" value={name} onChange={(e) => setName(e.target.value)} required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "6px" }} />
          <input type="number" placeholder="Harga (Rp)" value={price} onChange={(e) => setPrice(e.target.value)} required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "6px" }} />
          <input type="number" placeholder="Stok" value={stock} onChange={(e) => setStock(e.target.value)} required
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "6px" }} />
          <textarea placeholder="Deskripsi (Opsional)" value={description} onChange={(e) => setDescription(e.target.value)}
            style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "6px", minHeight: "80px" }} />
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{ padding: "0.5rem 1rem", border: "1px solid #ccc", borderRadius: "6px", background: "white" }}>Batal</button>
            <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem", background: "#e11d48", color: "white", border: "none", borderRadius: "6px" }}>
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
