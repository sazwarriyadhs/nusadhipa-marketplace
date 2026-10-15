"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

export type Role = "customer" | "tenant";

type Props = {
  mode: "login" | "register";
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  children: ReactNode;
};

export function AuthShell({
  mode,
  activeRole,
  onRoleChange,
  children,
}: Props) {
  const isLogin = mode === "login";

  return (
    <main className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-brand__mark" aria-hidden="true">
            N
          </span>
          <div className="auth-brand__text">
            <strong>NUSA-DHIPA</strong>
            <small>Marketplace UMKM</small>
          </div>
        </div>

        {/* Title */}
        <h1 className="auth-title">
          {isLogin ? "Masuk ke akun Anda" : "Buat akun baru"}
        </h1>
        <p className="auth-subtitle">
          {isLogin
            ? "Pilih tipe akun, lalu masukkan kredensial Anda."
            : "Pilih tipe akun dan lengkapi data pendaftaran."}
        </p>

        {/* Role tabs */}
        <div
          className="auth-tabs"
          role="tablist"
          aria-label="Pilih tipe akun"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeRole === "customer"}
            className={`auth-tab${
              activeRole === "customer" ? " is-active" : ""
            }`}
            onClick={() => onRoleChange("customer")}
          >
            <span aria-hidden="true">🛍️</span>
            <span>
              <strong>Customer</strong>
              <small>Belanja produk</small>
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeRole === "tenant"}
            className={`auth-tab${activeRole === "tenant" ? " is-active" : ""}`}
            onClick={() => onRoleChange("tenant")}
          >
            <span aria-hidden="true">🏪</span>
            <span>
              <strong>Mitra Usaha</strong>
              <small>Jual produk</small>
            </span>
          </button>
        </div>

        {/* Form slot */}
        {children}

        {/* Footer */}
        <div className="auth-footer">
          {isLogin ? (
            <>
              Belum punya akun?{" "}
              <Link href="/register">Daftar sekarang</Link>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <Link href="/login">Masuk di sini</Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}