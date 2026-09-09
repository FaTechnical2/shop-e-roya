import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { buildFacets, formatToman } from "@/lib/products";
import { productRowsQueryOptions, useProducts } from "@/lib/products.queries";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "پوشاک مردانه و پسرانه | گلدن‌کارت" },
      {
        name: "description",
        content:
          "خرید پیراهن، تیشرت، شلوار، هودی، کت و پالتو مردانه و پسرانه با جستجو و فیلتر سایز، رنگ، برند و قیمت.",
      },
      { property: "og:title", content: "محصولات پوشاک مردانه و پسرانه گلدن‌کارت" },
      {
        property: "og:description",
        content: "فیلتر پیشرفته روی سایز، رنگ، دسته‌بندی، برند و محدوده قیمت.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

type SortKey = "featured" | "cheap" | "expensive" | "rating";

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function ChipGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-ink">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onToggle(o)}
            className={
              selected.includes(o)
                ? "btn-golden rounded-full px-3 py-1.5 text-xs font-bold"
                : "rounded-full border border-sand bg-card px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:text-ink"
            }
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductsPage() {
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [brandSel, setBrandSel] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [onlyStock, setOnlyStock] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [openFilters, setOpenFilters] = useState(false);

  const list = useMemo(() => {
    const q = query.trim();
    const filtered = products.filter((p) => {
      if (q && !`${p.name} ${p.brand} ${p.category} ${p.description}`.includes(q)) return false;
      if (gender.length && !gender.includes(p.gender)) return false;
      if (cats.length && !cats.includes(p.category)) return false;
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false;
      if (colors.length && !p.colors.some((c) => colors.includes(c.name))) return false;
      if (brandSel.length && !brandSel.includes(p.brand)) return false;
      if (p.price > maxPrice) return false;
      if (onlyStock && !p.inStock) return false;
      if (onlyDiscount && !p.oldPrice) return false;
      return true;
    });
    const sorted = [...filtered];
    if (sort === "cheap") sorted.sort((a, b) => a.price - b.price);
    if (sort === "expensive") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [query, gender, cats, sizes, colors, brandSel, maxPrice, onlyStock, onlyDiscount, sort]);

  const activeCount =
    gender.length +
    cats.length +
    sizes.length +
    colors.length +
    brandSel.length +
    (maxPrice < priceBounds.max ? 1 : 0) +
    (onlyStock ? 1 : 0) +
    (onlyDiscount ? 1 : 0);

  function resetAll() {
    setGender([]);
    setCats([]);
    setSizes([]);
    setColors([]);
    setBrandSel([]);
    setMaxPrice(priceBounds.max);
    setOnlyStock(false);
    setOnlyDiscount(false);
  }

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-10">
      <h1 className="text-3xl font-black tracking-tight text-ink">پوشاک مردانه و پسرانه</h1>
      <p className="mt-2 text-sm text-ink/60">
        {products.length.toLocaleString("fa-IR")} کالا؛ با جستجو و فیلتر سایز، رنگ، برند و قیمت
        دقیقاً همان چیزی را پیدا کنید که می‌خواهید.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="جستجو در محصولات… مثلاً پیراهن، هودی، جین"
            aria-label="جستجوی محصولات"
            className="h-12 w-full rounded-full border border-sand bg-card pr-11 pl-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-primary"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="مرتب‌سازی"
          className="h-12 rounded-full border border-sand bg-card px-4 text-sm font-medium text-ink outline-none focus:border-primary"
        >
          <option value="featured">مرتب‌سازی: پیشنهاد ما</option>
          <option value="cheap">ارزان‌ترین</option>
          <option value="expensive">گران‌ترین</option>
          <option value="rating">بیشترین امتیاز</option>
        </select>
        <button
          onClick={() => setOpenFilters((v) => !v)}
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-sand bg-card px-5 text-sm font-bold text-ink lg:hidden"
        >
          <SlidersHorizontal className="size-4" />
          فیلترها{activeCount > 0 ? ` (${activeCount.toLocaleString("fa-IR")})` : ""}
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside
          className={`${openFilters ? "block" : "hidden"} card-glass h-fit space-y-6 rounded-3xl p-5 lg:block`}
        >
          <div className="flex items-center justify-between">
            <p className="text-base font-black text-ink">فیلتر پیشرفته</p>
            {activeCount > 0 && (
              <button
                onClick={resetAll}
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <X className="size-3" /> حذف همه
              </button>
            )}
          </div>

          <ChipGroup
            title="جنسیت"
            options={genders}
            selected={gender}
            onToggle={(v) => setGender(toggle(gender, v))}
          />
          <ChipGroup
            title="دسته‌بندی"
            options={categories}
            selected={cats}
            onToggle={(v) => setCats(toggle(cats, v))}
          />
          <ChipGroup
            title="سایز"
            options={allSizes}
            selected={sizes}
            onToggle={(v) => setSizes(toggle(sizes, v))}
          />

          <div>
            <p className="mb-2 text-sm font-bold text-ink">رنگ</p>
            <div className="flex flex-wrap gap-2">
              {allColors.map((c) => {
                const on = colors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => setColors(toggle(colors, c.name))}
                    title={c.name}
                    aria-label={c.name}
                    aria-pressed={on}
                    className={`size-8 rounded-full border-2 transition-transform ${
                      on ? "scale-110 border-primary" : "border-sand"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </div>

          <ChipGroup
            title="برند"
            options={brands}
            selected={brandSel}
            onToggle={(v) => setBrandSel(toggle(brandSel, v))}
          />

          <div>
            <p className="mb-2 text-sm font-bold text-ink">
              حداکثر قیمت: {formatToman(maxPrice)} تومان
            </p>
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="حداکثر قیمت"
              className="w-full accent-[var(--brand)]"
            />
          </div>

          <div className="space-y-2 border-t border-sand pt-4 text-sm text-ink/75">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlyStock}
                onChange={(e) => setOnlyStock(e.target.checked)}
                className="size-4 accent-[var(--brand)]"
              />
              فقط کالاهای موجود
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlyDiscount}
                onChange={(e) => setOnlyDiscount(e.target.checked)}
                className="size-4 accent-[var(--brand)]"
              />
              فقط کالاهای تخفیف‌دار
            </label>
          </div>
        </aside>

        <section>
          <p className="mb-4 text-sm text-ink/60">
            {list.length.toLocaleString("fa-IR")} کالا یافت شد
          </p>
          {list.length === 0 ? (
            <div className="card-glass rounded-3xl p-10 text-center">
              <p className="text-lg font-bold text-ink">چیزی پیدا نشد</p>
              <p className="mt-2 text-sm text-ink/60">
                جستجو را کوتاه‌تر کنید یا چند فیلتر را بردارید.
              </p>
              <button onClick={resetAll} className="btn-golden mt-5 rounded-full px-5 py-2 text-sm font-bold">
                حذف فیلترها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
