import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBasket, Star } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatToman, rowToProduct, type ProductRow } from "@/lib/products";
import { getProduct } from "@/lib/products.functions";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const row = await getProduct({ data: { slug: params.id } });
    if (!row) throw notFound();
    return { product: rowToProduct(row as unknown as ProductRow) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "محصول یافت نشد | گلدن‌کارت" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} | گلدن‌کارت`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description.slice(0, 155) },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0]?.name ?? "");

  function handleAdd() {
    if (product.sizes.length > 0 && !size) {
      toast.error("لطفاً ابتدا سایز را انتخاب کنید");
      return;
    }
    const picked = product.colors.find((c) => c.name === color);
    add({
      productId: product.id,
      size: size ?? "",
      colorName: picked?.name ?? "",
      colorHex: picked?.hex ?? "",
    });
  }

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-10">
      <nav className="mb-6 text-sm text-ink/50">
        <Link to="/products" className="hover:text-primary">
          محصولات
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid items-start gap-10 md:grid-cols-2">
        <img
          src={product.image}
          alt={product.name}
          width={1024}
          height={1024}
          className="aspect-square w-full rounded-[2rem] border border-sand/70 object-cover"
        />
        <div>
          <p className="text-sm font-bold text-brand">
            {product.brand} · {product.gender} · {product.category}
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight text-ink">
            {product.name}
          </h1>
          <p className="mt-2 flex items-center gap-1 text-sm font-bold text-ink/60">
            <Star className="size-4 fill-brand text-brand" />
            {product.rating.toLocaleString("fa-IR")} از ۵
          </p>
          <p className="mt-5 leading-relaxed text-ink/65">{product.description}</p>
          <p className="mt-3 text-sm text-ink/55">جنس: {product.material}</p>

          <div className="mt-7">
            <p className="mb-2 text-sm font-bold text-ink">
              رنگ: <span className="font-medium text-ink/60">{color}</span>
            </p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  title={c.name}
                  className={`size-9 rounded-full border-2 transition-transform ${
                    color === c.name ? "scale-110 border-primary" : "border-sand"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-bold text-ink">سایز</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={
                    size === s
                      ? "btn-golden min-w-14 rounded-xl px-4 py-2 text-sm font-bold"
                      : "min-w-14 rounded-xl border border-sand bg-card px-4 py-2 text-sm font-medium text-ink/70 hover:text-ink"
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {(product.discountPercent > 0 || product.offerLabel) && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {product.discountPercent > 0 && (
                <span className="rounded-full bg-destructive px-4 py-1.5 text-sm font-black text-cream">
                  ٪{product.discountPercent.toLocaleString("fa-IR")} تخفیف
                </span>
              )}
              {product.offerLabel && (
                <span className="rounded-full bg-ink px-4 py-1.5 text-sm font-bold text-cream">
                  {product.offerLabel}
                </span>
              )}
              {product.offerUntil && (
                <span className="text-xs text-ink/55">
                  تا {new Date(product.offerUntil).toLocaleDateString("fa-IR")}
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex items-end gap-3">
            {product.oldPrice && (
              <span className="text-base text-ink/40 line-through">
                {formatToman(product.oldPrice)}
              </span>
            )}
            <span className="text-3xl font-black text-primary">
              {formatToman(product.price)}{" "}
              <span className="text-sm font-medium text-ink/50">تومان</span>
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="btn-golden mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-bold disabled:opacity-40"
          >
            <ShoppingBasket className="size-5" />
            {product.inStock ? "افزودن به سبد خرید" : "ناموجود"}
          </button>

          <ul className="mt-8 space-y-2 border-t border-sand pt-6 text-sm text-ink/60">
            <li>ارسال رایگان برای سفارش‌های بالای ۲٬۰۰۰٬۰۰۰ تومان</li>
            <li>تعویض سایز رایگان تا ۷ روز</li>
            <li>ضمانت اصالت کالا</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
