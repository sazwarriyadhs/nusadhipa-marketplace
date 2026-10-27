/* =========================================================
   AUTH API — NUSA-DHIPA Marketplace
   Wrapper untuk endpoint /auth/* di backend
   ========================================================= */

const API_BASE = (
  process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ||
  process.env.MARKETPLACE_API_URL ||
  "http://127.0.0.1:4000/api/v1"
).replace(/\/+$/, "");

const TOKEN_KEY = "nd_auth_token";
const USER_KEY = "nd_auth_user";

export type UserRole = "customer" | "tenant";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status?: "pending" | "active" | "inactive";
  businessName?: string;
  businessType?: string;
  businessId?: number; // Tambahan
};

export type LoginInput = {
  email: string;
  password: string;
  role: UserRole;
};

export type RegisterInput = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  businessName?: string;
  businessType?: string;
};

export type LoginResponse = {
  success: boolean;
  token?: string;
  tokenType?: string;
  expiresIn?: number;
  user?: AuthUser;
  message?: string;
};

export type RegisterResponse = {
  success: boolean;
  message?: string;
  user?: AuthUser;
};

/* ---------- Token storage (client-side only) ---------- */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

/* ---------- User cache (untuk persist session) ---------- */

export function getCachedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setCachedUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

/* ---------- API calls ---------- */

export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    }),
  });

  const data = (await res.json()) as LoginResponse;

  if (!res.ok || !data.success || !data.token) {
    return {
      success: false,
      message:
        data.message ||
        "Login gagal. Periksa email dan password Anda.",
    };
  }

  /* Simpan token */
  setToken(data.token);

  /* Simpan user dengan role dari input (backend belum kirim role) */
  const user: AuthUser = {
    id: data.user?.id ?? "",
    fullName: data.user?.fullName ?? "",
    email: data.user?.email ?? input.email,
    role: input.role,
    status: "active",
    businessId: (data.user as any)?.business_id ?? undefined, // Tambahan
  };
  setCachedUser(user);

  return { ...data, user };
}

export async function register(
  input: RegisterInput,
): Promise<RegisterResponse> {
  /* Field tenant disimpan sementara di localStorage untuk nanti */
  if (input.role === "tenant" && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        "nd_pending_tenant",
        JSON.stringify({
          businessName: input.businessName,
          businessType: input.businessType,
          email: input.email,
        }),
      );
    } catch {
      /* ignore */
    }
  }

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || undefined,
      password: input.password,
    }),
  });

  const data = (await res.json()) as RegisterResponse;

  if (!res.ok || !data.success) {
    return {
      success: false,
      message:
        data.message ||
        "Registrasi gagal. Silakan coba lagi.",
    };
  }

  return data;
}

export function logout(): void {
  clearToken();
}
