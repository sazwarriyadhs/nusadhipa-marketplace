"use client";

import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}

export default AppProviders;