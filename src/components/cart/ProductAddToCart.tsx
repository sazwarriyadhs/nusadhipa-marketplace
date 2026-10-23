"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { ProductVariant } from "@/lib/marketplace-api";
import { formatStock } from "@/lib/format-stock";

type Props = {
  productSlug: string;
  productName: string;
  businessName: string;
  imageUrl: string | null;
  variants: ProductVariant[];
};

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductAddToCart({
  productSlug,
  productName,
  businessName,
  imageUrl,
  variants,
}: Props) {
  const { addItem } = useCart();

  const availableVariants = variants.filter(
    (variant) => Number(variant.available_stock) > 0,
  );

  const [variantId, setVariantId] = useState<number | "">(
    availableVariants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const selectedVariant = availableVariants.find(
    (variant) => variant.id === variantId,
  );

  function handleAdd() {
    if (!selectedVariant) {
      setMessage("Pilih varian yang stoknya tersedia.");
      return;
    }

    const stock = Number(selectedVariant.available_stock);
    const price = Number(selectedVariant.price);

    if (!Number.isFinite(price) || price < 0 || stock < 1) {
      setMessage("Harga atau stok produk tidak valid.");
      return;
    }

    addItem({
      productSlug,
      productName,
      businessName,
      variantId: selectedVariant.id,
      variantName: selectedVariant.variant_name,
      price,
      stock,
      stockUnit: selectedVariant.selling_unit ?? (selectedVariant.sales_mode === "weight" ? "kg" : "unit"),
      imageUrl,
      quantity,
    });

    setMessage("Produk ditambahkan ke keranjang.");
  }

  return (
    <section className="product-purchase">
      <h2>Pesan Produk</h2>

      {availableVariants.length === 0 ? (
        <p className="product-out-of-stock">
          Maaf, semua varian produk sedang kehabisan stok.
        </p>
      ) : (
        <>
          <label className="product-purchase-label" htmlFor="product-variant">
            Pilih varian
          </label>

          <select
            id="product-variant"
            className="product-variant-select"
            value={variantId}
            onChange={(event) => {
              setVariantId(Number(event.target.value));
              setQuantity(1);
              setMessage("");
            }}
          >
            {availableVariants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.variant_name} — {rupiah(Number(variant.price))} — Stok{" "}
                {formatStock(variant.available_stock, variant.selling_unit, variant.sales_mode)}
              </option>
            ))}
          </select>

          {selectedVariant && (
            <div className="product-purchase-price">
              {rupiah(Number(selectedVariant.price))}
            </div>
          )}

          <label className="product-purchase-label" htmlFor="product-quantity">
            Jumlah
          </label>

          <input
            id="product-quantity"
            className="product-quantity-input"
            type="number"
            min={1}
            max={selectedVariant?.available_stock ?? 1}
            value={quantity}
            onChange={(event) => {
              const next = Number(event.target.value);
              const max = Number(selectedVariant?.available_stock ?? 1);

              setQuantity(
                Number.isFinite(next)
                  ? Math.max(1, Math.min(max, Math.floor(next)))
                  : 1,
              );
              setMessage("");
            }}
          />

          <button
            type="button"
            className="product-add-cart-button"
            onClick={handleAdd}
            disabled={!selectedVariant}
          >
            + Tambah ke Keranjang
          </button>

          <p className="product-cart-message" role="status" aria-live="polite">
            {message}
          </p>
        </>
      )}
    </section>
  );
}
