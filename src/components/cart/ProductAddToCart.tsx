"use client";

import { useState } from "react";
import { useCart, type SellingMode } from "@/components/cart/CartProvider";
import type { ProductVariant } from "@/lib/marketplace-api";

type Props = {
  productSlug: string;
  productName: string;
  businessName: string;
  brand?: string | null;
  imageUrl: string | null;
  variants: ProductVariant[];
};

type PurchaseOption = {
  mode: SellingMode;
  label: string;
  unit: string;
  minQty: number;
  maxQty: number;
  step: number;
  price: number;
  available: boolean;
  reason: string;
};

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function effectiveMinimum(minimum: number, step: number) {
  return Math.ceil(minimum / step - 1e-10) * step;
}

function getPurchaseOptions(
  variant: ProductVariant,
  brand?: string | null,
): PurchaseOption[] {
  const unit = String(variant.selling_unit || "").trim().toLowerCase();
  const salesMode = String(variant.sales_mode || "").trim().toLowerCase();
  const stock = Number(variant.available_stock);
  const isSauriFresh =
    String(brand || "").trim().toLowerCase() === "sauri fresh";

  if (!Number.isFinite(stock) || stock <= 0) return [];

  if (salesMode === "package" && unit !== "kg") {
    const step = Number(variant.quantity_step ?? 1);
    const priceValue = variant.retail_price ?? variant.price;
    const price = priceValue == null || priceValue === ""
      ? NaN
      : Number(priceValue);
    const minQty = Number.isFinite(step) && step > 0
      ? effectiveMinimum(1, step)
      : 1;

    return [{
      mode: "package",
      label: "Package",
      unit: unit || "unit",
      minQty,
      maxQty: stock,
      step,
      price,
      available:
        Number.isFinite(step) && step > 0 &&
        Number.isFinite(price) && price > 0 &&
        minQty <= stock,
      reason: !Number.isFinite(price) || price <= 0
        ? "Harga package belum ditetapkan."
        : "Konfigurasi package tidak valid.",
    }];
  }

  if (salesMode !== "weight" || unit !== "kg") return [];

  const configuredRetailMin = Number(variant.min_retail_kg ?? 0.5);
  const configuredB2BMin = Number(variant.min_b2b_kg ?? 50);
  const retailStep = Number(variant.retail_step_kg ?? 0.5);
  const b2bStep = Number(variant.b2b_step_kg ?? 1);

  const retailMin = isSauriFresh ? 1 : configuredRetailMin;
  const b2bMin = isSauriFresh
    ? Math.max(100, configuredB2BMin)
    : configuredB2BMin;

  const retailPriceValue = variant.retail_price ?? variant.price;
  const retailPrice = retailPriceValue == null || retailPriceValue === ""
    ? NaN
    : Number(retailPriceValue);

  const b2bPrice = variant.b2b_price == null || variant.b2b_price === ""
    ? NaN
    : Number(variant.b2b_price);

  const retailMax = Math.min(stock, isSauriFresh ? 99 : stock);
  const b2bMax = stock;

  return [
    {
      mode: "retail",
      label: "Retail",
      unit: "kg",
      minQty: effectiveMinimum(retailMin, retailStep),
      maxQty: retailMax,
      step: retailStep,
      price: retailPrice,
      available:
        Number.isFinite(retailMin) && retailMin > 0 &&
        Number.isFinite(retailStep) && retailStep > 0 &&
        Number.isFinite(retailPrice) && retailPrice > 0 &&
        effectiveMinimum(retailMin, retailStep) <= retailMax,
      reason: !Number.isFinite(retailPrice) || retailPrice <= 0
        ? "Harga retail belum ditetapkan."
        : "Aturan quantity retail tidak valid.",
    },
    {
      mode: "b2b",
      label: "B2B / Grosir",
      unit: "kg",
      minQty: effectiveMinimum(b2bMin, b2bStep),
      maxQty: b2bMax,
      step: b2bStep,
      price: b2bPrice,
      available:
        Number.isFinite(b2bMin) && b2bMin > 0 &&
        Number.isFinite(b2bStep) && b2bStep > 0 &&
        Number.isFinite(b2bPrice) && b2bPrice > 0 &&
        effectiveMinimum(b2bMin, b2bStep) <= b2bMax,
      reason: !Number.isFinite(b2bPrice) || b2bPrice <= 0
        ? "Harga B2B belum ditetapkan."
        : "Aturan quantity B2B tidak valid.",
    },
  ];
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
  const [sellingMode, setSellingMode] = useState<SellingMode>("retail");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const selectedVariant = availableVariants.find(
    (variant) => variant.id === variantId,
  );

  const options = selectedVariant
    ? getPurchaseOptions(selectedVariant, brand)
    : [];

  const selectedOption =
    options.find((option) => option.mode === sellingMode) ??
    options.find((option) => option.available) ??
    options[0];

  function handleAdd() {
    if (!selectedVariant || !selectedOption?.available) {
      setMessage(selectedOption?.reason || "Pilih varian dan mode penjualan yang tersedia.");
      return;
    }

    const rules = selectedOption;

    if (
      !Number.isFinite(quantity) ||
      quantity < rules.minQty ||
      quantity > rules.maxQty ||
      Math.abs(quantity / rules.step - Math.round(quantity / rules.step)) > 1e-8
    ) {
      setMessage(
        `Jumlah minimal ${rules.minQty} ${rules.unit}, maksimal ${rules.maxQty} ${rules.unit}, kelipatan ${rules.step} ${rules.unit}.`,
      );
      return;
    }

    const added = addItem({
      productSlug,
      productName,
      businessName,
      variantId: selectedVariant.id,
      variantName: selectedVariant.variant_name,
      price: rules.price,
      stock: rules.maxQty,
      imageUrl,
      quantity,
      sellingMode: rules.mode,
      stockUnit: rules.unit,
      minQuantity: rules.minQty,
      quantityStep: rules.step,
    });

    setMessage(
      added
        ? "Produk berhasil ditambahkan ke keranjang."
        : "Gagal menambahkan produk. Periksa jumlah dan stok keranjang.",
    );
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

              const nextOptions = nextVariant
                ? getPurchaseOptions(nextVariant, brand)
                : [];

              const nextOption =
                nextOptions.find((option) => option.available) ??
                nextOptions[0];

              if (nextOption) {
                setSellingMode(nextOption.mode);
                setQuantity(nextOption.minQty);
              } else {
                setQuantity(1);
              }

              setMessage("");
            }}
          >
            {availableVariants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.variant_name} — Stok {variant.available_stock}
              </option>
            ))}
          </select>

          {options.length > 0 ? (
            <>
              <label className="product-purchase-label" htmlFor="selling-mode">
                Mode penjualan
              </label>

              <select
                id="selling-mode"
                className="product-variant-select"
                value={selectedOption?.mode ?? ""}
                onChange={(event) => {
                  const nextOption = options.find(
                    (option) => option.mode === event.target.value,
                  );

                  if (nextOption) {
                    setSellingMode(nextOption.mode);
                    setQuantity(nextOption.minQty);
                    setMessage("");
                  }
                }}
              >
                {options.map((option) => (
                  <option
                    key={option.mode}
                    value={option.mode}
                    disabled={!option.available}
                  >
                    {option.label}
                    {option.available
                      ? ` — ${rupiah(option.price)}/${option.unit}`
                      : ` — ${option.reason}`}
                  </option>
                ))}
              </select>

              {selectedOption?.available ? (
                <>
                  <div className="product-purchase-price">
                    {rupiah(selectedOption.price)} / {selectedOption.unit}
                  </div>

                  <p>
                    Minimal: {selectedOption.minQty} {selectedOption.unit}
                    {" · "}
                    Maksimal: {selectedOption.maxQty} {selectedOption.unit}
                    {" · "}
                    Kelipatan: {selectedOption.step} {selectedOption.unit}
                  </p>

                  <label
                    className="product-purchase-label"
                    htmlFor="product-quantity"
                  >
                    Jumlah ({selectedOption.unit})
                  </label>

                  <input
                    id="product-quantity"
                    className="product-quantity-input"
                    type="number"
                    min={selectedOption.minQty}
                    max={selectedOption.maxQty}
                    step={selectedOption.step}
                    value={quantity}
                    onChange={(event) => {
                      const raw = event.target.value;
                      setQuantity(raw === "" ? 0 : Number(raw));
                      setMessage("");
                    }}
                  />
                </>
              ) : (
                <p className="product-out-of-stock">
                  {selectedOption?.reason || "Tidak ada mode penjualan yang tersedia."}
                </p>
              )}
            </>
          ) : (
            <p className="product-out-of-stock">
              Konfigurasi penjualan produk belum tersedia atau tidak valid.
            </p>
          )}

          <button
            type="button"
            className="product-add-cart-button"
            onClick={handleAdd}
            disabled={!selectedOption?.available}
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
