import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  /** شناسه یکتای ترکیب محصول + سایز + رنگ */
  key: string;
  productId: string;
  size: string;
  colorName: string;
  colorHex: string;
  qty: number;
}

export interface CartSelection {
  productId: string;
  size?: string;
  colorName?: string;
  colorHex?: string;
}

export function cartKey(productId: string, size: string, colorName: string): string {
  return `${productId}|${size}|${colorName}`;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (selection: CartSelection) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  totalCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "goldencart-cart";

function normalize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((i): i is Record<string, unknown> => Boolean(i) && typeof i === "object")
    .map((i) => {
      const productId = String(i["productId"] ?? "");
      const size = String(i["size"] ?? "");
      const colorName = String(i["colorName"] ?? "");
      return {
        key: String(i["key"] ?? cartKey(productId, size, colorName)),
        productId,
        size,
        colorName,
        colorHex: String(i["colorHex"] ?? ""),
        qty: Number(i["qty"] ?? 1) || 1,
      };
    })
    .filter((i) => i.productId);
}

function loadInitial(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return normalize(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadInitial());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((selection: CartSelection) => {
    const size = selection.size ?? "";
    const colorName = selection.colorName ?? "";
    const key = cartKey(selection.productId, size, colorName);
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          key,
          productId: selection.productId,
          size,
          colorName,
          colorHex: selection.colorHex ?? "",
          qty: 1,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, isOpen, openCart, closeCart, add, remove, setQty, clear, totalCount }),
    [items, isOpen, openCart, closeCart, add, remove, setQty, clear, totalCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
