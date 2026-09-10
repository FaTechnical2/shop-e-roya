import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatToman } from "@/lib/products";
import {
  listOrders,
  updateOrderStatus,
  ORDER_STATUS_LABELS,
  type OrderRow,
  type OrderStatus,
} from "@/lib/orders.functions";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({
    meta: [
      { title: "مدیریت سفارش‌ها | گلدن‌کارت" },
      { name: "description", content: "پیگیری و مدیریت سفارش‌های ثبت‌شده فروشگاه گلدن‌کارت." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminOrdersPage,
});

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusClass: Record<OrderStatus, string> = {
  pending: "bg-ink/10 text-ink/70",
  confirmed: "bg-primary/10 text-primary",
  shipped: "bg-brand/20 text-brand",
  delivered: "bg-primary text-cream",
  cancelled: "bg-destructive/10 text-destructive",
};

function faDate(iso: string) {
  return new Date(iso).toLocaleString("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function AdminOrdersPage() {
  const fetchOrders = useServerFn(listOrders);
  const setStatus = useServerFn(updateOrderStatus);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => fetchOrders(),
  });

  const orders: OrderRow[] = data ?? [];
  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  async function changeStatus(order: OrderRow, status: OrderStatus) {
    try {
      await setStatus({ data: { id: order.id, status } });
      await refetch();
      toast.success(`وضعیت سفارش ${order.order_number} به «${ORDER_STATUS_LABELS[status]}» تغییر کرد`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تغییر وضعیت ناموفق بود");
    }
  }

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink">مدیریت سفارش‌ها</h1>
          <p className="mt-2 text-sm text-ink/60">
            {orders.length.toLocaleString("fa-IR")} سفارش ثبت شده است.
          </p>
        </div>
        <Link
          to="/admin"
          className="inline-flex h-12 items-center rounded-full border border-sand px-6 text-sm font-bold text-ink"
        >
          مدیریت محصولات
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "btn-golden rounded-full px-4 py-2 text-xs font-bold"
              : "rounded-full border border-sand bg-card px-4 py-2 text-xs font-medium text-ink/70"
          }
        >
          همه
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={
              filter === s
                ? "btn-golden rounded-full px-4 py-2 text-xs font-bold"
                : "rounded-full border border-sand bg-card px-4 py-2 text-xs font-medium text-ink/70"
            }
          >
            {ORDER_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="mt-10 grid place-items-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <p className="mt-8 text-sm text-destructive">
          {error instanceof Error ? error.message : "خطا در دریافت سفارش‌ها"}
        </p>
      )}

      <section className="mt-6 space-y-4">
        {!isLoading && list.length === 0 && (
          <p className="rounded-3xl border border-sand bg-card p-10 text-center text-sm text-ink/60">
            سفارشی در این وضعیت وجود ندارد.
          </p>
        )}
        {list.map((order) => (
          <article key={order.id} className="rounded-3xl border border-sand bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-base font-black text-ink">سفارش {order.order_number}</p>
                <p className="mt-1 text-xs text-ink/55">{faDate(order.created_at)}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[order.status]}`}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>

            <div className="mt-3 grid gap-1 text-sm text-ink/70 sm:grid-cols-2">
              <p>مشتری: {order.customer_name}</p>
              <p>تماس: {order.phone}</p>
              <p className="sm:col-span-2">نشانی: {order.address}</p>
              {order.note && <p className="sm:col-span-2">توضیح: {order.note}</p>}
            </div>

            <ul className="mt-4 space-y-2 border-t border-sand pt-4">
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
                    {item.qty.toLocaleString("fa-IR")} عدد ×‌ {formatToman(item.unit_price)} تومان
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sand pt-4">
              <p className="text-sm text-ink/60">
                کالاها {formatToman(order.subtotal)} + ارسال{" "}
                {order.shipping === 0 ? "رایگان" : formatToman(order.shipping)} ={" "}
                <span className="font-black text-primary">{formatToman(order.total)} تومان</span>
              </p>
              <label className="flex items-center gap-2 text-xs font-bold text-ink/70">
                تغییر وضعیت
                <select
                  value={order.status}
                  onChange={(e) => void changeStatus(order, e.target.value as OrderStatus)}
                  className="h-10 rounded-xl border border-sand bg-popover px-3 text-sm text-ink outline-none focus:border-primary"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
