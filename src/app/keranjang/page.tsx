"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatStock } from "@/lib/format-stock";

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function KeranjangPage() {
  const {
    items,
    hydrated,
    count,
    subtotal,
    setQuantity,
    removeItem,
  } = useCart();

  if (!hydrated) {
    return (
      <main className="cart-page">
        <p className="cart-loading">Memuat keranjang belanja...</p>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <div>
          <p className="cart-eyebrow">NUSA-DHIPA MARKETPLACE</p>
          <h1>Keranjang Belanja</h1>
          <p className="cart-description">
            Periksa produk dan jumlah pesanan sebelum melanjutkan.
          </p>
        </div>
        <Link href="/search" className="cart-continue-shopping">
          ← Lanjut Belanja
        </Link>
      </div>

      {items.length === 0 ? (
        <section className="cart-empty">
          <div className="cart-empty-icon" aria-hidden="true">🛒</div>
          <h2>Keranjangmu masih kosong</h2>
          <p>
            Yuk, temukan produk dari UMKM dan mitra usaha di NUSA-DHIPA.
          </p>
          <Link href="/search" className="cart-primary-button">
            Jelajahi Produk
          </Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items-panel" aria-label="Daftar barang">
            <div className="cart-items-heading">
              <h2>Produk Pilihanmu</h2>
              <span>{count} barang</span>
            </div>

            {items.map((item) => (
              <article className="cart-item" key={item.key}>
                <div className="cart-item-image">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.productName} />
                  ) : (
                    <span aria-hidden="true">N</span>
                  )}
                </div>

                <div className="cart-item-details">
                  <Link
                    href={`/produk/${encodeURIComponent(item.productSlug)}`}
                    className="cart-product-name"
                  >
                    {item.productName}
                  </Link>
                  <p className="cart-seller">{item.businessName}</p>
                  <p className="cart-variant">{item.variantName}</p>
                  <strong className="cart-unit-price">
                    {rupiah(item.price)}
                  </strong>

                  <div className="cart-item-actions">
                    <div className="cart-quantity" aria-label="Jumlah produk">
                      <button
                        type="button"
                        aria-label={`Kurangi ${item.productName}`}
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          setQuantity(item.key, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Tambah ${item.productName}`}
                        disabled={item.quantity >= item.stock}
                        onClick={() =>
                          setQuantity(item.key, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-button"
                      onClick={() => removeItem(item.key)}
                    >
                      Hapus
                    </button>
                  </div>
                  <p className="cart-stock-note">
                    Maksimum stok tercatat: {formatStock(item.stock, item.stockUnit, item.stockUnit === "kg" ? "weight" : undefined)}
                  </p>
                </div>

                <div className="cart-line-total">
                  <span>Total</span>
                  <strong>{rupiah(item.price * item.quantity)}</strong>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <h2>Ringkasan Belanja</h2>

            <div className="cart-summary-row">
              <span>Total barang</span>
              <span>{count} barang</span>
            </div>

            <div className="cart-summary-row cart-subtotal">
              <span>Subtotal produk</span>
              <strong>{rupiah(subtotal)}</strong>
            </div>

            <p className="cart-summary-note">
              Ongkos kirim dan total akhir akan dihitung saat checkout.
              Harga dan ketersediaan akan diverifikasi kembali oleh sistem.
            </p>

            <Link href="/checkout" className="cart-primary-button cart-checkout">
              Lanjut ke Checkout →
            </Link>

            <div className="cart-security-note">
              <span aria-hidden="true">🔒</span>
              <span>Periksa kembali alamat, harga, dan stok sebelum membayar.</span>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
