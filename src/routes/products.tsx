import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "محصولات | گلدن‌کارت" },
      {
        name: "description",
        content:
          "همه محصولات گلدن‌کارت: عطر، شمع، دیفیوزر، زعفران، عسل و لوازم خانه با قیمت شفاف.",
      },
      { property: "og:title", content: "محصولات گلدن‌کارت" },
      {
        property: "og:description",
        content: "فهرست کامل عطرها، شمع‌ها و لوازم خانه لوکس گلدن‌کارت.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [active, setActive] = useState("همه");
  const list = active === "همه" ? products : products.filter((p) => p.category === active);

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-10">
      <h1 className="text-3xl font-black tracking-tight text-ink">محصولات</h1>
      <p className="mt-2 text-sm text-ink/60">
        {products.length.toLocaleString("fa-IR")} کالای دست‌چین‌شده، آماده ارسال.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={
              active === c
                ? "btn-golden rounded-full px-4 py-2 text-sm font-bold"
                : "rounded-full border border-sand bg-card px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
