"use client";

import { useEffect, useRef, useState } from "react";

/* ---------- Hook: count-up saat masuk viewport ---------- */
function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Kalau target 0, tidak perlu animasi */
    if (target <= 0) {
      setValue(0);
      return;
    }

    /* Reduced motion → tampilkan angka final langsung */
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          /* ease-out cubic */
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.floor(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
          else setValue(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { value, ref };
}

/* ---------- Item ---------- */
function Stat({
  value,
  suffix,
  label,
  sub,
}: {
  value: number;
  suffix?: string;
  label: string;
  sub: string;
}) {
  const { value: n, ref } = useCountUp(value);

  return (
    <div className="nd-stat">
      <span className="nd-stat__num" ref={ref}>
        {n.toLocaleString("id-ID")}
        {suffix ?? ""}
      </span>
      <strong>{label}</strong>
      <small>{sub}</small>
    </div>
  );
}

/* ---------- Section ---------- */
export function TrustStats({
  totalProducts,
  totalSellers,
}: {
  totalProducts: number;
  totalSellers: number;
}) {
  /* Fallback biar tidak 0-0 terus saat API kosong */
  const products = totalProducts > 0 ? totalProducts : 100;
  const sellers = totalSellers > 0 ? totalSellers : 25;

  return (
    <section className="nd-trust-row" aria-label="Statistik marketplace">
      <div>
        <Stat
          value={products}
          suffix="+"
          label="Produk"
          sub="Katalog beragam"
        />
      </div>
      <div>
        <Stat
          value={sellers}
          suffix="+"
          label="Mitra Usaha"
          sub="Informasi usaha"
        />
      </div>
      <div>
        <Stat value={34} label="Provinsi" sub="Jangkauan nasional" />
      </div>
      <div>
        <Stat
          value={100}
          suffix="%"
          label="UMKM Lokal"
          sub="Fokus Nusantara"
        />
      </div>
    </section>
  );
}