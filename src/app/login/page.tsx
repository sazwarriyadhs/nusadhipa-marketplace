"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, type Role } from "@/components/auth/AuthShell";
import { useAuth } from "@/components/auth/AuthProvider";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const initialRole = (searchParams.get("type") as Role) || "customer";
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login({ email, password, role });

    setLoading(false);

    if (!result.success) {
      setError(result.message || "Login gagal.");
      return;
    }

    /* Redirect per role */
    const target = role === "tenant" ? "/" : "/keranjang";
    router.push(target);
    router.refresh();
  }

  return (
    <AuthShell mode="login" activeRole={role} onRoleChange={setRole}>
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 10 karakter"
            autoComplete="current-password"
            minLength={10}
            required
          />
        </label>

        {error ? (
          <div className="auth-error" role="alert">
            <span aria-hidden="true">⚠️</span> {error}
          </div>
        ) : null}

        <button
          type="submit"
          className="auth-submit"
          disabled={loading || !email || !password}
        >
          {loading ? "Memproses..." : `Masuk sebagai ${
            role === "tenant" ? "Mitra Usaha" : "Customer"
          }`}
        </button>

        <p className="auth-note">
          Dengan masuk, Anda menyetujui syarat dan ketentuan
          NUSA-DHIPA Marketplace.
        </p>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            color: "#777782",
            fontSize: "0.9rem",
          }}
        >
          Memuat halaman login...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}