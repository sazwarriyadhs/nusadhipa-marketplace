"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
};

type AddCartItem = Omit<CartItem, "key" | "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  addItem: (item: AddCartItem) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "nusadhipa-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item) =>
            item &&
            typeof item.key === "string" &&
            typeof item.productSlug === "string" &&
            typeof item.variantId === "number" &&
            typeof item.price === "number" &&
            typeof item.quantity === "number"
          ));
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: AddCartItem) => {
    if (!Number.isFinite(item.price) || item.price < 0) return;
    if (!Number.isFinite(item.stock) || item.stock < 1) return;

    const key = `${item.productSlug}:${item.variantId}`;
    const requestedQuantity = Math.max(
      1,
      Math.floor(item.quantity ?? 1),
    );

    setItems((current) => {
      const existing = current.find((entry) => entry.key === key);

      if (existing) {
        return current.map((entry) =>
          entry.key === key
            ? {
                ...entry,
                stock: item.stock,
                quantity: Math.min(
                  item.stock,
                  entry.quantity + requestedQuantity,
                ),
              }
            : entry,
        );
      }

      return [
        ...current,
        {
          ...item,
          key,
          quantity: Math.min(item.stock, requestedQuantity),
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    if (!Number.isFinite(quantity)) return;

    setItems((current) =>
      current.map((item) =>
        item.key === key
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(item.stock, Math.floor(quantity)),
              ),
            }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    hydrated,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ),
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  }), [items, hydrated, addItem, setQuantity, removeItem, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus digunakan di dalam CartProvider.");
  }
  return context;
}
