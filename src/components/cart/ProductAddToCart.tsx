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

function getSellingRules(variant: ProductVariant) {
  const sellingUnit =
    variant.selling_unit ||
    (variant.sales_mode === "weight" ? "kg" : "unit");

  const isWeight = sellingUnit === "kg";

  const configuredMin = Number(variant.min_retail_kg ?? 0.5);
  const configuredStep = Number(variant.retail_step_kg ?? 0.5);

  const minQty = isWeight
    ? Number.isFinite(configuredMin) && configuredMin > 0
      ? configuredMin
      : 0.5
    : 1;

  const step = isWeight
    ? Number.isFinite(configuredStep) && configuredStep > 0
      ? configuredStep
      : 0.5
    : 1;

  return { sellingUnit, minQty, step };
}

function isValidQuantity(quantity: number, minQty: number, step: number) {
  if (!Number.isFinite(quantity) || quantity < minQty - 1e-8) {
    return false;
  }

  return Math.abs(quantity / step - Math.round(quantity / step)) <= 1e-8;
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

  const initialVariant = availableVariants[0];
  const [quantity, setQuantity] = useState(
    initialVariant ? getSellingRules(initialVariant).minQty : 1,
  );
  const [message, setMessage] = useState("");

  const selectedVariant = availableVariants.find(
    (variant) => variant.id === variantId,
  );

  const rules = selectedVariant
    ? getSellingRules(selectedVariant)
    : { sellingUnit: "unit", minQty: 1, step: 1 };

  const stock = selectedVariant
    ? Number(selectedVariant.available_stock)
    : 0;

  const price = selectedVariant
    ? Number(selectedVariant.retail_price ?? selectedVariant.price)
    : 0;

  const canBuy =
    !!selectedVariant &&
    Number.isFinite(stock) &&
    stock >= rules.minQty &&
    Number.isFinite(price) &&
    price > 0;

  function handleAdd() {
    if (!selectedVariant) {
      setMessage("Pilih varian yang stoknya tersedia.");
      return;
    }

    if (!Number.isFinite(stock) || stock < rules.minQty) {
      setMessage(
        `Stok tidak mencukupi. Minimum pembelian ${rules.minQty} ${rules.sellingUnit}.`,
      );
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setMessage("Harga retail produk belum tersedia atau tidak valid.");
      return;
    }

    if (
      !Number.isFinite(quantity) ||
      quantity > stock + 1e-8 ||
      !isValidQuantity(quantity, rules.minQty, rules.step)
    ) {
      setMessage(
        `Jumlah harus minimal ${rules.minQty} ${rules.sellingUnit}, mengikuti kelipatan ${rules.step} ${rules.sellingUnit}, dan tidak melebihi stok ${stock}.`,
      );
      return;
    }

    addItem({
      productSlug,
      productName,
      businessName,
      variantId: selectedVariant.id,
      variantName: selectedVariant.variant_name || productName,
      price,
      stock,
      imageUrl,
      quantity,
      sellingUnit: rules.sellingUnit,
      minQty: rules.minQty,
      step: rules.step,
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

              setVariantId(nextId);
              setQuantity(
                nextVariant ? getSellingRules(nextVariant).minQty : 1,
              );
              setMessage("");
            }}
          >
            {availableVariants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.variant_name} —{" "}
                {rupiah(
                  Number(variant.retail_price ?? variant.price),
                )}{" "}
                — Stok {variant.available_stock}{" "}
                {getSellingRules(variant).sellingUnit}
              </option>
            ))}
          </select>

          {selectedVariant && (
            <div className="product-purchase-price">
              {rupiah(price)}
              {rules.sellingUnit === "kg" ? "/kg" : ""}
            </div>
          )}

          <label className="product-purchase-label" htmlFor="product-quantity">
            Jumlah ({rules.sellingUnit})
          </label>

          <input
            id="product-quantity"
            className="product-quantity-input"
            type="number"
            min={rules.minQty}
            max={stock}
            step={rules.step}
            value={quantity}
            disabled={!canBuy}
            onChange={(event) => {
              const raw = event.target.value;

              if (raw === "") {
                setQuantity(Number.NaN);
                setMessage("");
                return;
              }

              const next = Number(raw);
              setQuantity(
                Number.isFinite(next)
                  ? Math.min(stock, next)
                  : rules.minQty,
              );
              setMessage("");
            }}
          />

          <p className="product-cart-message">
            Minimum {rules.minQty} {rules.sellingUnit}; kelipatan{" "}
            {rules.step} {rules.sellingUnit}. Stok tersedia: {stock}{" "}
            {rules.sellingUnit}.
          </p>

          <button
            type="button"
            className="product-add-cart-button"
            onClick={handleAdd}
            disabled={!canBuy}
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
