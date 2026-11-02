"use client";

import Link from "next/link";
import CartCount from "@/components/cart/CartCount";
import { useAuth } from "@/components/auth/AuthProvider";

export default function HeaderClient() {
  const { user, hydrated, logout } = useAuth();

  // Mencegah "flicker" (teks berkedip) saat halaman pertama kali dimuat
  if (!hydrated) {
    return (
      <div className="nd-header-actions">
        <span className="nd-location">Indonesia</span>
        <span className="nd-account" style={{ opacity: 0.5 }}>Memuat...</span>
        <Link href="/keranjang" className="nd-cart" aria-label="Keranjang belanja">
          <CartCount />
        </Link>
      </div>
    );
  }

  return (
    <div className="nd-header-actions">
      <span className="nd-location">Indonesia</span>
      
      {user ? (
        // Jika user sudah login
        <button 
          onClick={logout} 
          className="nd-account" 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontFamily: 'inherit', 
            fontSize: 'inherit', 
            color: 'inherit',
            padding: 0
          }}
        >
          Logout
        </button>
      ) : (
        // Jika user belum login
        <Link href="/login" className="nd-account">
          Masuk / Daftar
        </Link>
      )}

      <Link
        href="/keranjang"
        className="nd-cart"
        aria-label="Keranjang belanja"
      >
        <CartCount />
      </Link>
    </div>
  );
}