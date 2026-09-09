import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatToman } from "@/lib/products";
import { useProducts } from "@/lib/products.queries";

export function CartDrawer() {
  const { items, isOpen, closeCart, setQty, remove } = useCart();
  const { products } = useProducts();

  const lines = items
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId)! }))
    .filter((i) => i.product);
  const total = lines.reduce((sum, i) => sum + i.qty * i.product.price, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="سبد خرید">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={closeCart} />
      <aside className="absolute inset-y-0 left-0 flex w-[360px] max-w-[88vw] flex-col bg-popover shadow-2xl">
        <div className="flex items-center justify-between border-b border-sand px-5 py-4">
          <h2 className="text-base font-black text-ink">سبد خرید</h2>
          <button
            onClick={closeCart}
            aria-label="بستن"
            className="grid size-9 place-items-center rounded-full border border-sand text-ink/60 transition-colors hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-auto px-5 py-4">
          {lines.length === 0 && (
            <p className="mt-10 text-center text-sm text-ink/50">
              سبد خرید شما خالی است.
            </p>
          )}
          {lines.map(({ product, qty }) => (
            <div
              key={product.id}
              className="flex gap-3 rounded-2xl border border-sand bg-card p-3"
            >
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                width={128}
                height={128}
                className="size-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-ink">{product.name}</h3>
                <p className="mt-0.5 text-xs text-ink/50">
                  {formatToman(product.price)} تومان
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border border-sand p-0.5">
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      aria-label="کمتر"
                      className="grid size-6 place-items-center rounded-full text-ink/70 hover:bg-sand"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-5 text-center text-[11px] font-bold text-ink">
                      {qty.toLocaleString("fa-IR")}
                    </span>
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      aria-label="بیشتر"
                      className="grid size-6 place-items-center rounded-full text-ink/70 hover:bg-sand"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(product.id)}
                    className="flex items-center gap-1 text-[11px] text-destructive"
                  >
                    <Trash2 className="size-3" /> حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-sand px-5 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink/60">جمع کل</span>
            <span className="font-black text-primary">
              {formatToman(total)} تومان
            </span>
          </div>
          <Link
            to="/cart"
            onClick={closeCart}
            className="btn-golden block w-full rounded-full py-3 text-center text-sm font-bold"
          >
            تکمیل خرید
          </Link>
        </div>
      </aside>
    </div>
  );
}
