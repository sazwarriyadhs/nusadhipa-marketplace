"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { formatRupiah, type ProductVariant } from "@/lib/marketplace-api";

type Props = {
  productSlug: string;
  productName: string;
  businessName: string;
  imageUrl: string | null;
  variants: ProductVariant[];
};

export default function ProductPurchase({ productSlug, productName, businessName, imageUrl, variants }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const availableVariants = useMemo(() => variants.filter((v) => Number(v.available_stock) > 0), [variants]);
  const [variantId, setVariantId] = useState<number>(availableVariants[0]?.id ?? variants[0]?.id ?? 0);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  if (!variant) {
    return <p className="mt-6 rounded-xl bg-gray-100 p-4 text-sm text-gray-600">Varian produk belum tersedia.</p>;
  }

  const unit = variant.selling_unit || (variant.sales_mode === "weight" ? "kg" : "unit");
  const isWeight = unit === "kg";
  const minQty = isWeight ? Number(variant.min_retail_kg ?? 0.5) : 1;
  const step = isWeight ? Number(variant.retail_step_kg ?? 0.5) : 1;
  const stock = Number(variant.available_stock ?? 0);
  const price = Number(variant.retail_price ?? variant.price);
  const currentQty = quantity ?? minQty;
  const canBuy = stock >= minQty && Number.isFinite(price) && price > 0;

  function addToCart(goToCart: boolean) {
    setMessage("");
    if (!canBuy) {
      setMessage(stock <= 0 ? "Stok varian ini sedang kosong." : "Harga retail varian ini belum tersedia.");
      return;
    }
    if (currentQty < minQty || currentQty > stock || Math.abs(currentQty / step - Math.round(currentQty / step)) > 1e-8) {
      setMessage(`Jumlah harus minimal ${minQty} ${unit} dan mengikuti kelipatan ${step} ${unit}.`);
      return;
    }
    addItem({
      productSlug, productName, businessName,
      variantId: variant.id,
      variantName: variant.variant_name || productName,
      price, quantity: currentQty, stock, imageUrl,
      sellingUnit: unit, minQty, step,
    });
    if (goToCart) router.push("/keranjang");
    else setMessage("Produk ditambahkan ke keranjang.");
  }

  return (
    <div className="mt-8 space-y-4">
      {variants.length > 1 && (
        <div>
          <label htmlFor="product-variant" className="mb-2 block text-sm font-semibold text-gray-700">Pilih varian</label>
          <select id="product-variant" value={variantId} onChange={(e) => { setVariantId(Number(e.target.value)); setQuantity(null); setMessage(""); }} className="w-full rounded-xl border border-gray-300 bg-white p-3">
            {variants.map((v) => <option key={v.id} value={v.id}>{v.variant_name} · {Number(v.available_stock) > 0 ? `Stok ${v.available_stock}` : "Stok habis"}</option>)}
          </select>
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Harga retail</p>
          <p className="text-xl font-bold text-gray-900">{formatRupiah(price)}{isWeight ? "/kg" : ""}</p>
          <p className="mt-1 text-xs text-gray-500">Stok: {stock} {unit}</p>
        </div>
        <div>
          <label htmlFor="product-quantity" className="mb-1 block text-xs font-semibold text-gray-600">Jumlah ({unit})</label>
          <input id="product-quantity" type="number" min={minQty} max={stock} step={step} value={currentQty} onChange={(e) => setQuantity(Number(e.target.value))} disabled={!canBuy} className="w-32 rounded-xl border border-gray-300 p-3" />
        </div>
      </div>
      {isWeight && variant.b2b_price != null && (
        <p className="text-sm text-gray-600">Harga B2B: <strong>{formatRupiah(variant.b2b_price)}/kg</strong> · Minimum {Number(variant.min_b2b_kg ?? 50)} kg. Harga B2B perlu dipilih melalui alur pesanan B2B.</p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => addToCart(false)} disabled={!canBuy} className="rounded-xl border border-red-600 px-5 py-3 font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">Tambah ke Keranjang</button>
        <button type="button" onClick={() => addToCart(true)} disabled={!canBuy} className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">Beli Sekarang</button>
      </div>
      {message && <p role="status" className="rounded-lg bg-gray-100 p-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
