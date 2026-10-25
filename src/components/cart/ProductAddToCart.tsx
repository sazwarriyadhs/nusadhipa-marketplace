
"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { ProductVariant } from "@/lib/marketplace-api";

type Props = {
  productSlug: string;
  productName: string;
  businessName: string;
  brand?: string | null;
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

function getRules(variant: ProductVariant) {
  const unit =
    variant.selling_unit ||
    (variant.sales_mode === "weight" ? "kg" : "unit");

  const isWeight = unit === "kg";
  const minQty = isWeight ? Number(variant.min_retail_kg ?? 0.5) : 1;
  const step = isWeight ? Number(variant.retail_step_kg ?? 0.5) : 1;
  const stock = Number(variant.available_stock);
  const price = Number(variant.retail_price ?? variant.price);

  return { unit, minQty, step, stock, price };
}

export default function ProductAddToCart({
  productSlug,
  productName,
  businessName,
  brand,
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

  const rules = selectedVariant ? getRules(selectedVariant) : null;

  function handleAdd() {
    if (!selectedVariant || !rules) {
      setMessage("Pilih varian yang stoknya tersedia.");
      return;
    }

    const { unit, minQty, step, stock, price } = rules;

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(stock) ||
      stock <= 0 ||
      !Number.isFinite(minQty) ||
      minQty <= 0 ||
      !Number.isFinite(step) ||
      step <= 0
    ) {
      setMessage("Harga, stok, atau aturan jumlah produk tidak valid.");
      return;
    }

    const stepsFromMinimum = (quantity - minQty) / step;
    const isValidStep =
      Math.abs(stepsFromMinimum - Math.round(stepsFromMinimum)) < 1e-8;

    if (
      !Number.isFinite(quantity) ||
      quantity < minQty ||
      quantity > stock ||
      !isValidStep
    ) {
      setMessage(
        `Jumlah minimal ${minQty} ${unit}, maksimal ${stock} ${unit}, dengan kelipatan ${step} ${unit}.`,
      );
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
      sellingMode: "retail",
      stockUnit: unit,
      minQuantity: minQty,
      quantityStep: step,
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
              const nextId = Number(event.target.value);
              const nextVariant = availableVariants.find(
                (variant) => variant.id === nextId,
              );

              setVariantId(nextVariant?.id ?? "");
              setQuantity(
                nextVariant ? getRules(nextVariant).minQty : 1,
              );
              setMessage("");
            }}
          >
            {availableVariants.map((variant) => {
              const variantRules = getRules(variant);

              return (
                <option key={variant.id} value={variant.id}>
                  {variant.variant_name} — {rupiah(variantRules.price)} — Stok{" "}
                  {variantRules.stock} {variantRules.unit}
                </option>
              );
            })}
          </select>

          {rules && (
            <>
              <div className="product-purchase-price">
                {rupiah(rules.price)} / {rules.unit}
              </div>

              <label
                className="product-purchase-label"
                htmlFor="product-quantity"
              >
                Jumlah ({rules.unit})
              </label>

              <input
                id="product-quantity"
                className="product-quantity-input"
                type="number"
                min={rules.minQty}
                max={rules.stock}
                step={rules.step}
                value={quantity}
                onChange={(event) => {
                  const raw = event.target.value;
                  setQuantity(raw === "" ? 0 : Number(raw));
                  setMessage("");
                }}
              />
            </>
          )}

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



