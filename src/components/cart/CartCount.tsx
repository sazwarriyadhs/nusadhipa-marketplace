"use client";

import { useCart } from "./CartProvider";

export default function CartCount() {
  const { count, hydrated } = useCart();

  return (
    <span aria-live="polite" aria-label={`${hydrated ? count : 0} item di keranjang`}>
      🛒{hydrated && count > 0 ? ` ${count}` : ""}
    </span>
  );
}
