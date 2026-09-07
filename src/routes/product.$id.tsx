import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatToman, products } from "@/lib/products";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
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
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();

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
          <p className="text-sm font-bold text-brand">{product.category}</p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight text-ink">
            {product.name}
          </h1>
          <p className="mt-5 leading-relaxed text-ink/65">{product.description}</p>

          <div className="mt-8 flex items-end gap-3">
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
            onClick={() => add(product.id)}
            className="btn-golden mt-8 inline-flex h-13 items-center gap-2 rounded-full px-8 py-3.5 text-base font-bold"
          >
            <ShoppingBasket className="size-5" />
            افزودن به سبد خرید
          </button>

          <ul className="mt-8 space-y-2 border-t border-sand pt-6 text-sm text-ink/60">
            <li>ارسال رایگان برای سفارش‌های بالای ۲٬۰۰۰٬۰۰۰ تومان</li>
            <li>ضمانت اصالت و بازگشت تا ۷ روز</li>
            <li>بسته‌بندی هدیه رایگان</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
