"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useState } from "react";
import { AddProductModal } from "./AddProductModal";

export function StoreOwnerActions({ businessId }: { businessId: number }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // Cek apakah user adalah pemilik toko
  const isOwner = user?.businessId === businessId;

  if (!isOwner) return null;

  return (
    <div className="store-owner-actions" style={{ marginBottom: "1rem" }}>
      <button
        onClick={() => setShowModal(true)}
        className="nd-btn nd-btn--primary"
        style={{ padding: "0.5rem 1rem", borderRadius: "8px" }}
      >
        + Tambah Produk
      </button>
      {showModal && (
        <AddProductModal businessId={businessId} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
