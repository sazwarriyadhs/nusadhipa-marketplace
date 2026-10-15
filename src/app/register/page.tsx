"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, type Role } from "@/components/auth/AuthShell";
import { useAuth } from "@/components/auth/AuthProvider";

const BUSINESS_TYPES = [
  "Makanan & Minuman",
  "Pertanian & Peternakan",
  "Fashion & Aksesori",
  "Elektronik & Digital",
  "Kesehatan & Kecantikan",
  "Rumah & Perlengkapan",
  "Jasa & Layanan",
  "Lainnya",
];

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  const initialRole = (searchParams.get("type") as Role) || "customer";
  const [role, setRole] = useState<Role>(initialRole);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    /* Validasi tenant */
    if (role === "tenant" && (!businessName.trim() || !businessType)) {
      setError("Nama usaha dan kategori usaha wajib diisi untuk mitra.");
      return;
    }

    setLoading(true);
    const result = await register({
      fullName,
      email,
      phone,
      password,
      role,
      businessName: role === "tenant" ? businessName : undefined,
      businessType: role === "tenant" ? businessType : undefined,
    });
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Registrasi gagal.");
      return;
    }

    /* Sukses — redirect ke login dengan notice */
    setSuccessMsg(
      result.message ||
        "Registrasi berhasil. Akun menunggu aktivasi admin."
    );

    setTimeout(() => {
      router.push(
        `/login?type=${role}&registered=1`
      );
    }, 2200);
  }

  return (
    <AuthShell mode="register" activeRole={role} onRoleChange={setRole}>
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <label className="auth-field">
          <span>Nama Lengkap</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama lengkap Anda"
            autoComplete="name"
            minLength={2}
            required
          />
        </label>

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
          <span>Nomor HP <em>(opsional)</em></span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0812xxxxxxx"
            autoComplete="tel"
          />
        </label>

        {role === "tenant" ? (
          <>
            <label className="auth-field">
              <span>Nama Usaha</span>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Contoh: Toko Berkah Jaya"
                required
              />
            </label>

            <label className="auth-field">
              <span>Kategori Usaha</span>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                required
              >
                <option value="">Pilih kategori</option>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : null}

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 10 karakter"
            autoComplete="new-password"
            minLength={10}
            required
          />
        </label>

        {error ? (
          <div className="auth-error" role="alert">
            <span aria-hidden="true">⚠️</span> {error}
          </div>
        ) : null}

        {successMsg ? (
          <div className="auth-success" role="status">
            <span aria-hidden="true">✅</span> {successMsg}
          </div>
        ) : null}

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading
            ? "Memproses..."
            : `Daftar sebagai ${
                role === "tenant" ? "Mitra Usaha" : "Customer"
              }`}
        </button>

        <p className="auth-note">
          {role === "tenant"
            ? "Akun mitra akan diverifikasi admin sebelum bisa digunakan."
            : "Akun akan aktif setelah diverifikasi admin."}
        </p>
      </form>
    </AuthShell>
  );
}

export default function RegisterPage() {
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
          Memuat halaman pendaftaran...
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}