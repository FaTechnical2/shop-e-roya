import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { discountedPrice, isDiscountActive } from "@/lib/products";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

export interface OrderItemRow {
  id: string;
  product_slug: string;
  product_name: string;
  image: string;
  size: string;
  color_name: string;
  color_hex: string;
  unit_price: number;
  qty: number;
}

export interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string;
  note: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items: OrderItemRow[];
}

export interface PlaceOrderInput {
  customerName: string;
  phone: string;
  address: string;
  note: string;
  items: {
    productId: string;
    size: string;
    colorName: string;
    colorHex: string;
    qty: number;
  }[];
}

function orderNumber(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `GC-${n}`;
}

async function assertAdmin(context: { supabase: { rpc: Function }; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("دسترسی مدیریت ندارید");
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((input: PlaceOrderInput) => {
    if (!input.customerName?.trim()) throw new Error("نام و نام خانوادگی الزامی است");
    if (!/^0\d{10}$/.test(input.phone?.trim() ?? ""))
      throw new Error("شماره موبایل باید ۱۱ رقم و با ۰ شروع شود");
    if (!input.address?.trim()) throw new Error("نشانی تحویل الزامی است");
    if (!input.items?.length) throw new Error("سبد خرید خالی است");
    return input;
  })
  .handler(async ({ data: input }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const slugs = Array.from(new Set(input.items.map((i) => i.productId)));
    const { data: products, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, slug, name, image, price, discount_percent, offer_until")
      .in("slug", slugs);
    if (pErr) throw new Error(pErr.message);
    if (!products?.length) throw new Error("محصولات سبد خرید یافت نشد");

    const lines = input.items
      .map((item) => {
        const p = products.find((x) => x.slug === item.productId);
        if (!p) return null;
        const active = isDiscountActive(p);
        const unit = active
          ? discountedPrice(p.price, Number(p.discount_percent ?? 0))
          : p.price;
        const qty = Math.max(1, Math.min(50, Math.round(item.qty)));
        return {
          product_id: p.id,
          product_slug: p.slug,
          product_name: p.name,
          image: p.image,
          size: item.size ?? "",
          color_name: item.colorName ?? "",
          color_hex: item.colorHex ?? "",
          unit_price: unit,
          qty,
        };
      })
      .filter((l): l is NonNullable<typeof l> => l !== null);

    if (!lines.length) throw new Error("محصولات سبد خرید یافت نشد");

    const subtotal = lines.reduce((s, l) => s + l.unit_price * l.qty, 0);
    const shipping = subtotal > 2000000 ? 0 : 120000;

    let created: { id: string; order_number: string } | null = null;
    for (let attempt = 0; attempt < 5 && !created; attempt++) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number: orderNumber(),
          customer_name: input.customerName.trim(),
          phone: input.phone.trim(),
          address: input.address.trim(),
          note: input.note?.trim() ?? "",
          subtotal,
          shipping,
          total: subtotal + shipping,
        })
        .select("id, order_number")
        .single();
      if (!error && data) created = data;
      else if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    }
    if (!created) throw new Error("ثبت سفارش ناموفق بود، دوباره تلاش کنید");

    const orderId = created.id;
    const { error: iErr } = await supabaseAdmin
      .from("order_items")
      .insert(lines.map((l) => ({ ...l, order_id: orderId })));
    if (iErr) throw new Error(iErr.message);

    return { orderNumber: created.order_number, total: subtotal + shipping };
  });

const ORDER_SELECT =
  "id, order_number, customer_name, phone, address, note, subtotal, shipping, total, status, created_at, order_items(id, product_slug, product_name, image, size, color_name, color_hex, unit_price, qty)";

export const trackOrder = createServerFn({ method: "GET" })
  .inputValidator((input: { orderNumber: string; phone: string }) => input)
  .handler(async ({ data: input }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const number = input.orderNumber.trim().toUpperCase();
    const phone = input.phone.trim();
    if (!number || !phone) throw new Error("شماره سفارش و شماره موبایل را وارد کنید");
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(ORDER_SELECT)
      .eq("order_number", number)
      .eq("phone", phone)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("سفارشی با این مشخصات پیدا نشد");
    return data as unknown as OrderRow;
  });

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(ORDER_SELECT)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as OrderRow[];
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: OrderStatus }) => input)
  .handler(async ({ data: input, context }) => {
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: input.status })
      .eq("id", input.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
