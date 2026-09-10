import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatToman } from "@/lib/products";
import { useProducts } from "@/lib/products.queries";
import { placeOrder } from "@/lib/orders.functions";

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
  const { products } = useProducts();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [placed, setPlaced] = useState<{ orderNumber: string; total: number } | null>(null);

  const lines = items
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId)! }))
    .filter((i) => i.product);
  const subtotal = lines.reduce((sum, i) => sum + i.qty * i.product.price, 0);
  const shipping = subtotal > 2000000 || subtotal === 0 ? 0 : 120000;

  async function submitOrder() {
    setSending(true);
    try {
      const result = await placeOrder({
        data: {
          customerName: name,
          phone,
          address,
          note,
          items: lines.map((l) => ({
            productId: l.productId,
            size: l.size,
            colorName: l.colorName,
            colorHex: l.colorHex,
            qty: l.qty,
          })),
        },
      });
      setPlaced(result);
      clear();
      toast.success(`سفارش شما با شماره ${result.orderNumber} ثبت شد`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ثبت سفارش ناموفق بود");
    } finally {
      setSending(false);
    }
  }

  if (placed) {
    return (
      <main className="relative z-10 mx-auto w-full max-w-3xl px-5 lg:px-10">
        <div className="rounded-3xl border border-sand bg-card p-12 text-center">
          <h1 className="text-2xl font-black text-ink">سفارش شما ثبت شد 🎉</h1>
          <p className="mt-4 text-ink/65">
            شماره پیگیری سفارش شما:{" "}
            <span className="font-black text-primary">{placed.orderNumber}</span>
          </p>
          <p className="mt-2 text-sm text-ink/60">
            مبلغ قابل پرداخت: {formatToman(placed.total)} تومان — همکاران ما به‌زودی با شما
            تماس می‌گیرند.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/track" className="btn-golden rounded-full px-6 py-3 text-sm font-bold">
              پیگیری سفارش
            </Link>
            <Link
              to="/products"
              className="rounded-full border border-sand px-6 py-3 text-sm font-bold text-ink"
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </main>
    );
  }

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
            {lines.map(({ product, qty, key, size, colorName, colorHex }) => (
              <div
                key={key}
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
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink/60">
                    {size && <span>سایز {size}</span>}
                    {colorName && (
                      <span className="inline-flex items-center gap-1">
                        <span
                          className="size-3.5 rounded-full border border-sand"
                          style={{ backgroundColor: colorHex }}
                        />
                        {colorName}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-ink/50">
                    {formatToman(product.price)} تومان
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-sand p-1">
                  <button
                    onClick={() => setQty(key, qty - 1)}
                    aria-label="کمتر"
                    className="grid size-8 place-items-center rounded-full text-ink/70 hover:bg-sand"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-ink">
                    {qty.toLocaleString("fa-IR")}
                  </span>
                  <button
                    onClick={() => setQty(key, qty + 1)}
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
                  onClick={() => remove(key)}
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
            <h2 className="text-lg font-black text-ink">اطلاعات تحویل</h2>
            <div className="mt-4 space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام و نام خانوادگی"
                aria-label="نام و نام خانوادگی"
                className="h-11 w-full rounded-2xl border border-sand bg-popover px-4 text-sm text-ink outline-none focus:border-primary"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="numeric"
                placeholder="شماره موبایل (۰۹…)"
                aria-label="شماره موبایل"
                className="h-11 w-full rounded-2xl border border-sand bg-popover px-4 text-sm text-ink outline-none focus:border-primary"
              />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="نشانی کامل تحویل"
                aria-label="نشانی"
                className="w-full rounded-2xl border border-sand bg-popover px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="توضیح سفارش (اختیاری)"
                aria-label="توضیح سفارش"
                className="w-full rounded-2xl border border-sand bg-popover px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              />
            </div>

            <dl className="mt-6 space-y-3 border-t border-sand pt-5 text-sm">
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
              onClick={submitOrder}
              disabled={sending}
              className="btn-golden mt-6 w-full rounded-full py-3.5 text-sm font-bold disabled:opacity-50"
            >
              {sending ? "در حال ثبت…" : "ثبت سفارش"}
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
