import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { formatToman } from "@/lib/products";
import { trackOrder, ORDER_STATUS_LABELS, type OrderRow } from "@/lib/orders.functions";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "پیگیری سفارش | گلدن‌کارت" },
      {
        name: "description",
        content:
          "با شماره سفارش و شماره موبایل، وضعیت، تاریخ و کالاهای سفارش خود را در گلدن‌کارت پیگیری کنید.",
      },
      { property: "og:title", content: "پیگیری سفارش | گلدن‌کارت" },
      {
        property: "og:description",
        content: "وضعیت سفارش خود را با شماره پیگیری و شماره موبایل ببینید.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    setMessage("");
    try {
      const result = await trackOrder({ data: { orderNumber: number, phone } });
      setOrder(result);
    } catch (e) {
      setOrder(null);
      setMessage(e instanceof Error ? e.message : "سفارشی پیدا نشد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative z-10 mx-auto w-full max-w-3xl px-5 lg:px-10">
      <h1 className="text-3xl font-black tracking-tight text-ink">پیگیری سفارش</h1>
      <p className="mt-2 text-sm text-ink/60">
        شماره سفارش (مثل GC-۱۲۳۴۵۶) و شماره موبایلی که هنگام ثبت سفارش وارد کرده‌اید را بنویسید.
      </p>

      <div className="card-glass mt-6 grid gap-3 rounded-3xl p-5 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="شماره سفارش"
          aria-label="شماره سفارش"
          className="h-12 rounded-2xl border border-sand bg-popover px-4 text-sm text-ink outline-none focus:border-primary"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="numeric"
          placeholder="شماره موبایل"
          aria-label="شماره موبایل"
          className="h-12 rounded-2xl border border-sand bg-popover px-4 text-sm text-ink outline-none focus:border-primary"
        />
        <button
          onClick={() => void search()}
          disabled={loading}
          className="btn-golden inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-bold disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          پیگیری
        </button>
      </div>

      {message && <p className="mt-5 text-sm text-destructive">{message}</p>}

      {order && (
        <section className="mt-8 rounded-3xl border border-sand bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-black text-ink">سفارش {order.order_number}</p>
              <p className="mt-1 text-xs text-ink/55">
                {new Date(order.created_at).toLocaleString("fa-IR", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>

          <ul className="mt-5 space-y-3 border-t border-sand pt-5">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-3 text-sm">
                <span className="font-bold text-ink">{item.product_name}</span>
                {item.size && <span className="text-ink/60">سایز {item.size}</span>}
                {item.color_name && (
                  <span className="inline-flex items-center gap-1 text-ink/60">
                    <span
                      className="size-3.5 rounded-full border border-sand"
                      style={{ backgroundColor: item.color_hex }}
                    />
                    {item.color_name}
                  </span>
                )}
                <span className="text-ink/60">
                  {item.qty.toLocaleString("fa-IR")} عدد × {formatToman(item.unit_price)} تومان
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t border-sand pt-5 text-sm text-ink/70">
            مبلغ کل:{" "}
            <span className="font-black text-primary">{formatToman(order.total)} تومان</span>
          </p>
        </section>
      )}
    </main>
  );
}
