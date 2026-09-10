import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  deleteProduct,
  saveProduct,
  type ProductInput,
} from "@/lib/products.functions";
import {
  isAdminQueryOptions,
  productRowsQueryOptions,
  useProductRows,
} from "@/lib/products.queries";
import { formatToman, resolveImage, STORAGE_PREFIX, type ProductRow } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "مدیریت محصولات | گلدن‌کارت" },
      { name: "description", content: "افزودن، ویرایش و حذف محصولات فروشگاه گلدن‌کارت." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

interface FormState {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  gender: string;
  category: string;
  price: string;
  oldPrice: string;
  image: string;
  description: string;
  material: string;
  sizesText: string;
  colors: { name: string; hex: string }[];
  rating: string;
  stock: string;
  badge: string;
  discountPercent: string;
  offerLabel: string;
  isOffer: boolean;
  offerUntil: string;
}

const emptyForm: FormState = {
  slug: "",
  name: "",
  brand: "",
  gender: "مردانه",
  category: "",
  price: "",
  oldPrice: "",
  image: "",
  description: "",
  material: "",
  sizesText: "",
  colors: [{ name: "مشکی", hex: "#20201f" }],
  rating: "5",
  stock: "0",
  badge: "",
  discountPercent: "0",
  offerLabel: "",
  isOffer: false,
  offerUntil: "",
};

function rowToForm(row: ProductRow): FormState {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    gender: row.gender,
    category: row.category,
    price: String(row.price),
    oldPrice: row.old_price ? String(row.old_price) : "",
    image: row.image,
    description: row.description,
    material: row.material,
    sizesText: (row.sizes ?? []).join("، "),
    colors: Array.isArray(row.colors) ? (row.colors as { name: string; hex: string }[]) : [],
    rating: String(row.rating),
    stock: String(row.stock),
    badge: row.badge ?? "",
    discountPercent: String(row.discount_percent ?? 0),
    offerLabel: row.offer_label ?? "",
    isOffer: Boolean(row.is_offer),
    offerUntil: row.offer_until ? row.offer_until.slice(0, 10) : "",
  };
}

const inputClass =
  "h-11 w-full rounded-xl border border-sand bg-card px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-primary";
const labelClass = "mb-1.5 block text-xs font-bold text-ink/70";

function AdminPage() {
  const queryClient = useQueryClient();
  const { data: adminData, isLoading: adminLoading } = useQuery(isAdminQueryOptions);
  const { rows, isLoading } = useProductRows();
  const save = useServerFn(saveProduct);
  const remove = useServerFn(deleteProduct);

  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isAdmin = adminData?.isAdmin === true;

  if (adminLoading) {
    return (
      <main className="relative z-10 mx-auto grid w-full max-w-7xl place-items-center px-5 py-20">
        <Loader2 className="size-6 animate-spin text-primary" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="relative z-10 mx-auto w-full max-w-3xl px-5 py-16 text-center">
        <h1 className="text-2xl font-black text-ink">دسترسی مدیریت ندارید</h1>
        <p className="mt-3 text-sm text-ink/60">
          این بخش فقط برای حساب مدیر فروشگاه است. اگر مدیر هستید، با همان ایمیل وارد شوید.
        </p>
        <Link to="/" className="btn-golden mt-6 inline-flex rounded-full px-6 py-3 text-sm font-bold">
          بازگشت به فروشگاه
        </Link>
      </main>
    );
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      update("image", `${STORAGE_PREFIX}${path}`);
      toast.success("عکس بارگذاری شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "بارگذاری عکس ناموفق بود");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      const payload: ProductInput = {
        ...(form.id ? { id: form.id } : {}),
        slug: form.slug.trim(),
        name: form.name.trim(),
        brand: form.brand.trim(),
        gender: form.gender,
        category: form.category.trim(),
        price: Number(form.price) || 0,
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        image: form.image,
        description: form.description.trim(),
        material: form.material.trim(),
        sizes: form.sizesText
          .split(/[،,]/)
          .map((s) => s.trim())
          .filter(Boolean),
        colors: form.colors.filter((c) => c.name.trim()),
        rating: Number(form.rating) || 5,
        stock: Number(form.stock) || 0,
        badge: form.badge.trim() || null,
        discountPercent: Number(form.discountPercent) || 0,
        offerLabel: form.offerLabel.trim() || null,
        isOffer: form.isOffer,
        offerUntil: form.offerUntil ? new Date(form.offerUntil).toISOString() : null,
      };
      await save({ data: payload });
      await queryClient.invalidateQueries({ queryKey: productRowsQueryOptions.queryKey });
      toast.success(form.id ? "محصول ویرایش شد" : "محصول اضافه شد");
      setForm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره ناموفق بود");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: ProductRow) {
    if (!window.confirm(`«${row.name}» حذف شود؟`)) return;
    try {
      await remove({ data: { id: row.id } });
      await queryClient.invalidateQueries({ queryKey: productRowsQueryOptions.queryKey });
      if (form?.id === row.id) setForm(null);
      toast.success("محصول حذف شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حذف ناموفق بود");
    }
  }

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink">مدیریت محصولات</h1>
          <p className="mt-2 text-sm text-ink/60">
            {rows.length.toLocaleString("fa-IR")} محصول در فروشگاه ثبت شده است.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/orders"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-sand px-6 text-sm font-bold text-ink"
          >
            سفارش‌ها
          </Link>
          <button
            onClick={() => setForm({ ...emptyForm })}
            className="btn-golden inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-bold"
          >
            <Plus className="size-4" /> محصول جدید
          </button>
        </div>
      </div>

      {form && (
        <section className="card-glass mt-8 rounded-3xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-black text-ink">
              {form.id ? "ویرایش محصول" : "افزودن محصول"}
            </h2>
            <button
              onClick={() => setForm(null)}
              aria-label="بستن فرم"
              className="grid size-9 place-items-center rounded-full border border-sand text-ink/60 hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="f-name">نام محصول</label>
              <input id="f-name" className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="f-slug">شناسه در آدرس (انگلیسی)</label>
              <input id="f-slug" className={inputClass} value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="mens-shirt" />
            </div>
            <div>
              <label className={labelClass} htmlFor="f-brand">برند</label>
              <input id="f-brand" className={inputClass} value={form.brand} onChange={(e) => update("brand", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="f-gender">جنسیت</label>
              <select id="f-gender" className={inputClass} value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                <option value="مردانه">مردانه</option>
                <option value="پسرانه">پسرانه</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="f-cat">دسته‌بندی</label>
              <input id="f-cat" className={inputClass} value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="پیراهن" />
            </div>
            <div>
              <label className={labelClass} htmlFor="f-price">قیمت (تومان)</label>
              <input id="f-price" type="number" className={inputClass} value={form.price} onChange={(e) => update("price", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="f-old">قیمت قبل از تخفیف (اختیاری)</label>
              <input id="f-old" type="number" className={inputClass} value={form.oldPrice} onChange={(e) => update("oldPrice", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="f-stock">موجودی انبار</label>
              <input id="f-stock" type="number" min={0} className={inputClass} value={form.stock} onChange={(e) => update("stock", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="f-rating">امتیاز (۱ تا ۵)</label>
              <input id="f-rating" type="number" step="0.1" min={0} max={5} className={inputClass} value={form.rating} onChange={(e) => update("rating", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="f-material">جنس پارچه</label>
              <input id="f-material" className={inputClass} value={form.material} onChange={(e) => update("material", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="f-badge">برچسب (اختیاری)</label>
              <input id="f-badge" className={inputClass} value={form.badge} onChange={(e) => update("badge", e.target.value)} placeholder="پرفروش" />
            </div>
            <div className="md:col-span-3 rounded-2xl border border-sand bg-card/60 p-4">
              <p className="mb-3 text-sm font-black text-ink">تخفیف و پیشنهاد ویژه</p>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={labelClass} htmlFor="f-disc">درصد تخفیف (۰ تا ۹۰)</label>
                  <input id="f-disc" type="number" min={0} max={90} className={inputClass} value={form.discountPercent} onChange={(e) => update("discountPercent", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="f-offer-label">متن پیشنهاد (اختیاری)</label>
                  <input id="f-offer-label" className={inputClass} value={form.offerLabel} onChange={(e) => update("offerLabel", e.target.value)} placeholder="پیشنهاد شگفت‌انگیز" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="f-offer-until">پایان تخفیف (اختیاری)</label>
                  <input id="f-offer-until" type="date" className={inputClass} value={form.offerUntil} onChange={(e) => update("offerUntil", e.target.value)} />
                </div>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-ink/75">
                <input
                  type="checkbox"
                  checked={form.isOffer}
                  onChange={(e) => update("isOffer", e.target.checked)}
                  className="size-4 accent-[var(--brand)]"
                />
                نمایش در بخش «پیشنهادهای ویژه» صفحه محصولات
              </label>
              {Number(form.discountPercent) > 0 && Number(form.price) > 0 && (
                <p className="mt-2 text-xs text-ink/60">
                  قیمت نهایی پس از تخفیف:{" "}
                  <span className="font-black text-primary">
                    {formatToman(
                      Math.round(
                        (Number(form.price) -
                          (Number(form.price) * Number(form.discountPercent)) / 100) /
                          1000,
                      ) * 1000,
                    )}{" "}
                    تومان
                  </span>
                </p>
              )}
            </div>
            <div className="md:col-span-3">
              <label className={labelClass} htmlFor="f-sizes">سایزها (با ویرگول جدا کنید)</label>
              <input id="f-sizes" className={inputClass} value={form.sizesText} onChange={(e) => update("sizesText", e.target.value)} placeholder="S، M، L، XL" />
            </div>
            <div className="md:col-span-3">
              <label className={labelClass} htmlFor="f-desc">توضیحات</label>
              <textarea id="f-desc" rows={3} className="w-full rounded-xl border border-sand bg-card p-4 text-sm text-ink outline-none focus:border-primary" value={form.description} onChange={(e) => update("description", e.target.value)} />
            </div>

            <div className="md:col-span-3">
              <p className={labelClass}>رنگ‌ها</p>
              <div className="space-y-2">
                {form.colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      aria-label="نام رنگ"
                      className={inputClass}
                      value={c.name}
                      onChange={(e) =>
                        update(
                          "colors",
                          form.colors.map((x, xi) => (xi === i ? { ...x, name: e.target.value } : x)),
                        )
                      }
                      placeholder="نام رنگ"
                    />
                    <input
                      aria-label="کد رنگ"
                      type="color"
                      className="h-11 w-16 shrink-0 rounded-xl border border-sand bg-card"
                      value={c.hex}
                      onChange={(e) =>
                        update(
                          "colors",
                          form.colors.map((x, xi) => (xi === i ? { ...x, hex: e.target.value } : x)),
                        )
                      }
                    />
                    <button
                      onClick={() => update("colors", form.colors.filter((_, xi) => xi !== i))}
                      aria-label="حذف رنگ"
                      className="grid size-11 shrink-0 place-items-center rounded-xl border border-sand text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => update("colors", [...form.colors, { name: "", hex: "#c19a6b" }])}
                className="mt-2 inline-flex items-center gap-1 rounded-full border border-sand px-4 py-2 text-xs font-bold text-ink/70 hover:text-ink"
              >
                <Plus className="size-3" /> افزودن رنگ
              </button>
            </div>

            <div className="md:col-span-3">
              <p className={labelClass}>عکس محصول</p>
              <div className="flex flex-wrap items-center gap-4">
                {form.image && (
                  <img
                    src={resolveImage(form.image)}
                    alt="پیش‌نمایش عکس محصول"
                    className="size-24 rounded-2xl border border-sand object-cover"
                  />
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-sand bg-card px-5 py-3 text-sm font-bold text-ink">
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  {form.image ? "تغییر عکس" : "بارگذاری عکس"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUpload(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-7 flex gap-3">
            <button
              onClick={() => void handleSave()}
              disabled={saving}
              className="btn-golden inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold disabled:opacity-50"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              ذخیره محصول
            </button>
            <button
              onClick={() => setForm(null)}
              className="rounded-full border border-sand px-6 py-3 text-sm font-bold text-ink/70"
            >
              انصراف
            </button>
          </div>
        </section>
      )}

      <section className="mt-8 space-y-3">
        {isLoading && <p className="text-sm text-ink/50">در حال بارگذاری…</p>}
        {rows.map((row) => (
          <article
            key={row.id}
            className="flex flex-wrap items-center gap-4 rounded-3xl border border-sand bg-card p-4"
          >
            <img
              src={resolveImage(row.image)}
              alt={row.name}
              loading="lazy"
              className="size-16 rounded-2xl border border-sand object-cover"
            />
            <div className="min-w-40 flex-1">
              <p className="text-xs font-bold text-brand">
                {row.gender} · {row.category || "بدون دسته"}
              </p>
              <h2 className="text-base font-bold text-ink">{row.name}</h2>
              <p className="mt-1 text-xs text-ink/50">
                {formatToman(row.price)} تومان · {(row.sizes ?? []).join("، ") || "بدون سایز"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {(Array.isArray(row.colors) ? (row.colors as { name: string; hex: string }[]) : []).map(
                (c) => (
                  <span
                    key={c.name}
                    title={c.name}
                    className="size-4 rounded-full border border-sand"
                    style={{ backgroundColor: c.hex }}
                  />
                ),
              )}
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                row.stock > 0 ? "bg-primary/10 text-primary" : "bg-ink/10 text-ink/60"
              }`}
            >
              موجودی: {row.stock.toLocaleString("fa-IR")}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setForm(rowToForm(row))}
                className="inline-flex items-center gap-1 rounded-full border border-sand px-4 py-2 text-xs font-bold text-ink/75 hover:text-ink"
              >
                <Pencil className="size-3" /> ویرایش
              </button>
              <button
                onClick={() => void handleDelete(row)}
                className="inline-flex items-center gap-1 rounded-full border border-destructive/30 px-4 py-2 text-xs font-bold text-destructive"
              >
                <Trash2 className="size-3" /> حذف
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
