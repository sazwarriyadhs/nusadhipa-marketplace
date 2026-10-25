"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";

export type SellingMode = "retail" | "b2b" | "package";

export type CartItem = {
  key: string;
  productSlug: string;
  productName: string;
  businessName: string;
  variantId: number;
  variantName: string;
  price: number;
  quantity: number;
  stock: number;
  stockUnit?: string | null;
  imageUrl: string | null;
  sellingMode: SellingMode;
  quantityStep: number;
  minQuantity: number;
};

type AddCartItem = Omit<CartItem, "key" | "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  addItem: (item: AddCartItem) => boolean;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "nusadhipa-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function normalizeItem(value: any): CartItem | null {
  if (
    !value || typeof value.key !== "string" ||
    typeof value.productSlug !== "string" ||
    !Number.isFinite(value.variantId) ||
    !Number.isFinite(value.price) ||
    !Number.isFinite(value.quantity) ||
    !Number.isFinite(value.stock)
  ) return null;

  const sellingMode: SellingMode =
    value.sellingMode === "b2b" || value.sellingMode === "package"
      ? value.sellingMode : "retail";

  return {
    ...value,
    sellingMode,
    quantityStep: Number(value.quantityStep) > 0 ? Number(value.quantityStep) : 1,
    minQuantity: Number(value.minQuantity) > 0 ? Number(value.minQuantity) : 1,
  } as CartItem;
}

function validStep(quantity: number, step: number) {
  return Math.abs(quantity / step - Math.round(quantity / step)) < 1e-8;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed.map(normalizeItem).filter((x): x is CartItem => x !== null));
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: AddCartItem): boolean => {
    const step = item.quantityStep > 0 ? item.quantityStep : 1;
    const min = item.minQuantity > 0 ? item.minQuantity : 1;
    const qty = item.quantity ?? min;

    if (
      !Number.isFinite(item.price) || item.price <= 0 ||
      !Number.isFinite(item.stock) || item.stock < 0 ||
      !Number.isFinite(qty) || qty < min || qty > item.stock ||
      !validStep(qty, step)
    ) return false;

    const key = `${item.productSlug}:${item.variantId}:${item.sellingMode}`;
    const existing = items.find(entry => entry.key === key);

    if (existing) {
      const combined = existing.quantity + qty;
      if (combined > item.stock || !validStep(combined, step)) return false;

      setItems(items.map(entry => entry.key === key
        ? { ...entry, stock: item.stock, quantity: combined }
        : entry));
      return true;
    }

    setItems([...items, { ...item, key, quantity: qty, quantityStep: step, minQuantity: min }]);
    return true;
  }, [items]);

  const setQuantity = useCallback((key: string, quantity: number) => {
    if (!Number.isFinite(quantity)) return;
    setItems(current => current.map(item => {
      if (item.key !== key) return item;
      if (
        quantity < item.minQuantity ||
        quantity > item.stock ||
        !validStep(quantity, item.quantityStep)
      ) return item;
      return { ...item, quantity };
    }));
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems(current => current.filter(item => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    hydrated,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    addItem, setQuantity, removeItem, clearCart,
  }), [items, hydrated, addItem, setQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart harus digunakan di dalam CartProvider.");
  return context;
}
