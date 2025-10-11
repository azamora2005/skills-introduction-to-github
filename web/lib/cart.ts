"use client";

import { useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: number;
  variantId?: number | null;
  slug: string;
  title: string;
  variantName?: string | null;
  priceCents: number;
  quantity: number;
};

const STORAGE_KEY = "ka_cart_v1";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    writeCart(items);
  }, [items]);

  const subtotalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    [items]
  );

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((prev) => {
      const idx = prev.findIndex(
        (p) => p.productId === item.productId && p.variantId === item.variantId
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { ...item, quantity }];
    });
  }

  function updateQuantity(productId: number, variantId: number | null | undefined, quantity: number) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(productId: number, variantId: number | null | undefined) {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  }

  function clear() {
    setItems([]);
  }

  return { items, subtotalCents, addItem, updateQuantity, removeItem, clear } as const;
}
