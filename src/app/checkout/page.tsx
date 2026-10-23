"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE } from "@/lib/marketplace-api";

const FREE_RADIUS_KM = 5;
const BASE_SHIPPING = 5000;
const COST_PER_KM = 2000;

const COURIERS = [
  { id: "jne", name: "JNE", service: "REG", eta: "2-3 hari" },
  { id: "jnt", name: "J&T Express", service: "EZ", eta: "2-4 hari" },
  { id: "sicepat", name: "SiCepat", service: "REG", eta: "1-2 hari" },
];

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal: "",
    notes: "",
  });

  const [courier, setCourier] = useState("jne");
  const [distanceKm, setDistanceKm] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const shipping =
    distanceKm < FREE_RADIUS_KM
      ? 0
      : Math.round(BASE_SHIPPING + (distanceKm - FREE_RADIUS_KM) * COST_PER_KM);

  const grandTotal = subtotal + shipping;

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setMessage("");

    if (!form.name || !form.phone || !form.address || !form.city) {
      setMessage("Lengkapi nama, telepon, alamat, dan kota.");
      return;
    }

    setSubmitting(true);

    try {
      const body = {
        items: items.map((it) => ({
          variant_id: it.variantId,
          quantity: it.quantity,
        })),
        shipping_address: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          province: form.province,
          postal_code: form.postal,
        },
        courier,
        shipping_distance_km: distanceKm,
        customer_note: form.notes || undefined,
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal membuat pesanan");
      }

      setSuccess(true);
      setMessage(`✅ Pesanan ${json.data.order_number} berhasil dibuat!`);

      // Simpan ke sessionStorage untuk halaman sukses
      try {
        sessionStorage.setItem("last_order", JSON.stringify(json.data));
      } catch {}

      clearCart();

      // Redirect ke halaman sukses
      router.push("/checkout/success");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Gagal membuat pesanan";
      setMessage(`❌ ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 && !success) {
    return (
      <main className="nd-content" style={{ padding: "64px 20px", textAlign: "center" }}>
        <span style={{ fontSize: "3rem" }}>🛒</span>
        <h1 style={{ fontSize: "1.5rem", marginTop: 16 }}>Keranjang kosong</h1>
        <p style={{ color: "#64748b", marginTop: 8 }}>
          Tambahkan produk dulu untuk checkout.
        </p>
        <Link
          href="/search"
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "12px 24px",
            background: "#b91c2c",
            color: "#fff",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Jelajahi Produk
        </Link>
      </main>
    );
  }

  return (
    <main className="nd-content checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit} className="checkout-form">
          <section className="checkout-section">
            <h2>Alamat Pengiriman</h2>

            <div className="checkout-field">
              <label>Nama Penerima *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div className="checkout-field">
              <label>Nomor WhatsApp *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                placeholder="08123456789"
                required
              />
            </div>

            <div className="checkout-field">
              <label>Alamat Lengkap *</label>
              <textarea
                value={form.address}
                onChange={(e) => updateForm("address", e.target.value)}
                placeholder="Jalan, nomor rumah, RT/RW"
                rows={3}
                required
              />
            </div>

            <div className="checkout-row">
              <div className="checkout-field">
                <label>Kota *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  placeholder="Kota Bogor"
                  required
                />
              </div>
              <div className="checkout-field">
                <label>Provinsi</label>
                <input
                  type="text"
                  value={form.province}
                  onChange={(e) => updateForm("province", e.target.value)}
                  placeholder="Jawa Barat"
                />
              </div>
            </div>

            <div className="checkout-field">
              <label>Kode Pos</label>
              <input
                type="text"
                value={form.postal}
                onChange={(e) => updateForm("postal", e.target.value)}
                placeholder="16143"
              />
            </div>

            <div className="checkout-field">
              <label>Catatan (opsional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => updateForm("notes", e.target.value)}
                placeholder="Catatan untuk penjual"
                rows={2}
              />
            </div>
          </section>

          <section className="checkout-section">
            <h2>Pilih Kurir</h2>
            <div className="checkout-couriers">
              {COURIERS.map((c) => (
                <label
                  key={c.id}
                  className={`checkout-courier${courier === c.id ? " is-active" : ""}`}
                >
                  <input
                    type="radio"
                    name="courier"
                    value={c.id}
                    checked={courier === c.id}
                    onChange={() => setCourier(c.id)}
                  />
                  <div>
                    <strong>{c.name}</strong>
                    <small>{c.service} · {c.eta}</small>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="checkout-section">
            <h2>Jarak Pengiriman</h2>
            <input
              type="range"
              min={1}
              max={50}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="checkout-range"
            />
            <p className="checkout-distance">
              📍 {distanceKm} km dari toko ·{" "}
              {distanceKm <= FREE_RADIUS_KM ? (
                <strong style={{ color: "#16a34a" }}>🎁 GRATIS ONGKIR</strong>
              ) : (
                <strong style={{ color: "#b91c2c" }}>
                  Ongkir {rupiah(shipping)}
                </strong>
              )}
            </p>
          </section>
        </form>

        {/* ===== RINGKASAN ===== */}
        <aside className="checkout-summary">
          <h2>Ringkasan Pesanan</h2>

          <div className="checkout-items">
            {items.map((item) => (
              <div key={item.key} className="checkout-item">
                <div className="checkout-item-info">
                  <strong>{item.productName}</strong>
                  <small>
                    {item.variantName} · {item.quantity}x
                  </small>
                </div>
                <span className="checkout-item-price">
                  {rupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout-divider" />

          <div className="checkout-line">
            <span>Subtotal ({items.length} produk)</span>
            <strong>{rupiah(subtotal)}</strong>
          </div>

          <div className="checkout-line">
            <span>Ongkir ({COURIERS.find((c) => c.id === courier)?.name})</span>
            <span>
              {shipping === 0 ? (
                <strong style={{ color: "#16a34a" }}>GRATIS</strong>
              ) : (
                rupiah(shipping)
              )}
            </span>
          </div>

          <div className="checkout-divider" />

          <div className="checkout-line checkout-line--total">
            <span>Total</span>
            <strong>{rupiah(grandTotal)}</strong>
          </div>

          {message && (
            <div className={`checkout-message${success ? " is-success" : ""}`}>
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={submitting || success}
            className="checkout-submit"
          >
            {submitting ? "Memproses..." : success ? "✅ Berhasil!" : "Buat Pesanan →"}
          </button>

          <p className="checkout-note">
            🔒 Data kamu aman. Pesanan akan dikonfirmasi via WhatsApp.
          </p>
        </aside>
      </div>
    </main>
  );
}