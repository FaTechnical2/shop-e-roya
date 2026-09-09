import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatToman } from "@/lib/products";
import { useProducts } from "@/lib/products.queries";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سبد خرید | گلدن‌کارت" },
      {
        name: "description",
        content: "سبد خرید شما در گلدن‌کارت؛ بررسی کالاها و تکمیل سفارش.",
      },
      { property: "og:title", content: "سبد خرید | گلدن‌کارت" },
      { property: "og:description", content: "کالاهای انتخابی خود را بررسی و سفارش را نهایی کنید." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, clear } = useCart();

  const lines = items
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId)! }))
    .filter((i) => i.product);
  const subtotal = lines.reduce((sum, i) => sum + i.qty * i.product.price, 0);
  const shipping = subtotal > 2000000 || subtotal === 0 ? 0 : 120000;

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-10">
      <h1 className="text-3xl font-black tracking-tight text-ink">سبد خرید</h1>

      {lines.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-sand bg-card p-12 text-center">
          <p className="text-ink/60">سبد خرید شما خالی است.</p>
          <Link
            to="/products"
            className="btn-golden mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold"
          >
            رفتن به محصولات
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {lines.map(({ product, qty }) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center gap-4 rounded-3xl border border-sand bg-card p-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  width={256}
                  height={256}
                  className="size-24 rounded-2xl object-cover"
                />
                <div className="min-w-40 flex-1">
                  <p className="text-xs font-bold text-brand">{product.category}</p>
                  <h2 className="text-lg font-bold text-ink">{product.name}</h2>
                  <p className="mt-1 text-sm text-ink/50">
                    {formatToman(product.price)} تومان
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-sand p-1">
                  <button
                    onClick={() => setQty(product.id, qty - 1)}
                    aria-label="کمتر"
                    className="grid size-8 place-items-center rounded-full text-ink/70 hover:bg-sand"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-ink">
                    {qty.toLocaleString("fa-IR")}
                  </span>
                  <button
                    onClick={() => setQty(product.id, qty + 1)}
                    aria-label="بیشتر"
                    className="grid size-8 place-items-center rounded-full text-ink/70 hover:bg-sand"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <p className="w-32 text-left font-black text-primary">
                  {formatToman(product.price * qty)}
                </p>
                <button
                  onClick={() => remove(product.id)}
                  aria-label="حذف"
                  className="grid size-9 place-items-center rounded-full text-destructive hover:bg-sand"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <button onClick={clear} className="text-sm text-ink/50 hover:text-destructive">
              خالی کردن سبد
            </button>
          </div>

          <aside className="h-fit rounded-3xl border border-sand bg-card p-6">
            <h2 className="text-lg font-black text-ink">خلاصه سفارش</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">جمع کالاها</dt>
                <dd className="font-bold text-ink">{formatToman(subtotal)} تومان</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60">هزینه ارسال</dt>
                <dd className="font-bold text-ink">
                  {shipping === 0 ? "رایگان" : `${formatToman(shipping)} تومان`}
                </dd>
              </div>
              <div className="flex justify-between border-t border-sand pt-3 text-base">
                <dt className="font-bold text-ink">مبلغ قابل پرداخت</dt>
                <dd className="font-black text-primary">
                  {formatToman(subtotal + shipping)} تومان
                </dd>
              </div>
            </dl>
            <button
              onClick={() => toast.success("سفارش شما ثبت شد! به‌زودی با شما تماس می‌گیریم.")}
              className="btn-golden mt-6 w-full rounded-full py-3.5 text-sm font-bold"
            >
              پرداخت و ثبت سفارش
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
