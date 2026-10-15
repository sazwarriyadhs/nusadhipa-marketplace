"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCachedUser,
  getToken,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from "@/lib/auth-api";

type AuthContextValue = {
  user: AuthUser | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<{ success: boolean; message?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  /* Restore session dari localStorage */
  useEffect(() => {
    const token = getToken();
    const cached = getCachedUser();
    if (token && cached) {
      setUser(cached);
    }
    setHydrated(true);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const result = await apiLogin(input);
    if (result.success && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, message: result.message };
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const result = await apiRegister(input);
    if (result.success) {
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        hydrated,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  }
  return ctx;
}