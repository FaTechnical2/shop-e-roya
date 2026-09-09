import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PRODUCT_COLUMNS =
  "id, slug, name, brand, gender, category, price, old_price, image, description, material, sizes, colors, rating, stock, badge, sort_order";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data: input }) => {
    const { data, error } = await publicClient()
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ?? null;
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) return { isAdmin: false };
    return { isAdmin: Boolean(data) };
  });

export interface ProductInput {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  gender: string;
  category: string;
  price: number;
  oldPrice: number | null;
  image: string;
  description: string;
  material: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  rating: number;
  stock: number;
  badge: string | null;
}

function validate(input: ProductInput): ProductInput {
  if (!input.slug?.trim()) throw new Error("شناسه محصول الزامی است");
  if (!input.name?.trim()) throw new Error("نام محصول الزامی است");
  if (!Number.isFinite(input.price) || input.price < 0) throw new Error("قیمت نامعتبر است");
  if (!Number.isFinite(input.stock) || input.stock < 0) throw new Error("موجودی نامعتبر است");
  return input;
}

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: ProductInput) => validate(input))
  .handler(async ({ data: input, context }) => {
    const payload = {
      slug: input.slug.trim(),
      name: input.name.trim(),
      brand: input.brand.trim(),
      gender: input.gender,
      category: input.category.trim(),
      price: Math.round(input.price),
      old_price: input.oldPrice && input.oldPrice > 0 ? Math.round(input.oldPrice) : null,
      image: input.image,
      description: input.description,
      material: input.material,
      sizes: input.sizes,
      colors: input.colors,
      rating: input.rating,
      stock: Math.round(input.stock),
      badge: input.badge?.trim() ? input.badge.trim() : null,
    };

    if (input.id) {
      const { error } = await context.supabase
        .from("products")
        .update(payload)
        .eq("id", input.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: input.id };
    }

    const { data, error } = await context.supabase
      .from("products")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: data.id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data: input, context }) => {
    const { error } = await context.supabase.from("products").delete().eq("id", input.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
