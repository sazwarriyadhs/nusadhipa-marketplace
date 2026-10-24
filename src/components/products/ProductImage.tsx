"use client";

import { useState } from "react";

type ProductImageProps = {
  src: string | null;
  fallbackSrc?: string | null;
  alt: string;
};

export default function ProductImage({ src, fallbackSrc, alt }: ProductImageProps) {
  const initialSrc = src || fallbackSrc || null;
  const [imageSrc, setImageSrc] = useState<string | null>(initialSrc);
  const [triedFallback, setTriedFallback] = useState(!src || src === fallbackSrc);

  function handleError() {
    if (!triedFallback && fallbackSrc && fallbackSrc !== imageSrc) {
      setTriedFallback(true);
      setImageSrc(fallbackSrc);
      return;
    }
    setImageSrc(null);
  }

  if (!imageSrc) {
    return (
      <div
        className="nd-store-product-card__empty"
        role="img"
        aria-label={`Foto ${alt} belum tersedia`}
        style={{
          width: "100%",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "#6b7280",
          background: "#f3f4f6",
        }}
      >
        <span aria-hidden="true" style={{ fontSize: "32px" }}>📦</span>
        <small>Foto produk belum tersedia</small>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={handleError}
      style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
    />
  );
}
