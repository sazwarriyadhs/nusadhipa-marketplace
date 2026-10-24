"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { ProductVariant } from "@/lib/marketplace-api";

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
    const unit = selectedVariant.selling_unit || (selectedVariant.sales_mode === "weight" ? "kg" : "unit");
    const isWeight = unit === "kg";
    const minQty = isWeight ? Number(selectedVariant.min_retail_kg ?? 0.5) : 1;
    const step = isWeight ? Number(selectedVariant.retail_step_kg ?? 0.5) : 1;
    const price = Number(selectedVariant.retail_price ?? selectedVariant.price);

    if (!Number.isFinite(price) || price < 0 || stock < 1) {
      setMessage("Harga atau stok produk tidak valid.");
      return;
    }

    if (quantity < minQty || quantity > stock || Math.abs(quantity / step - Math.round(quantity / step)) > 1e-8) {
      setMessage(`Jumlah harus minimal ${minQty} ${unit} dan mengikuti kelipatan ${step} ${unit}.`);
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
      imageUrl,
      quantity,
      sellingUnit: unit,
      minQty,
      step,
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
                {variant.available_stock}
              </option>
            ))}
          </select>

          {selectedVariant && (
            <div className="product-purchase-price">
              {rupiah(Number(selectedVariant.price))}
            </div>
          )}

          <label className="product-purchase-label" htmlFor="product-quantity">
            Jumlah ({selectedVariant?.selling_unit || (selectedVariant?.sales_mode === "weight" ? "kg" : "unit")})
          </label>

          <input
            id="product-quantity"
            className="product-quantity-input"
            type="number"
            min={selectedVariant ? (selectedVariant.selling_unit === "kg" || selectedVariant.sales_mode === "weight" ? Number(selectedVariant.min_retail_kg ?? 0.5) : 1) : 1}
            max={selectedVariant?.available_stock ?? 1}
            step={selectedVariant ? (selectedVariant.selling_unit === "kg" || selectedVariant.sales_mode === "weight" ? Number(selectedVariant.retail_step_kg ?? 0.5) : 1) : 1}
            value={quantity}
            onChange={(event) => {
              const next = Number(event.target.value);
              const max = Number(selectedVariant?.available_stock ?? 1);

              setQuantity(
                Number.isFinite(next)
                  ? Math.max(0.01, Math.min(max, next))
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
