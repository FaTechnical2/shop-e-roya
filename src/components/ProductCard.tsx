import { Link } from "@tanstack/react-router";
import { Plus, Star } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatToman, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className="card-glass group rounded-3xl p-4">
      <Link to="/product/$id" params={{ id: product.id }} className="relative mb-4 block">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="aspect-square w-full rounded-2xl object-cover"
        />
        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-cream">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[11px] font-bold text-cream">
            ناموجود
          </span>
        )}
      </Link>

      <div className="mb-1 flex items-center justify-between text-xs">
        <p className="font-bold text-brand">
          {product.gender} · {product.category}
        </p>
        <span className="flex items-center gap-1 font-bold text-ink/60">
          <Star className="size-3 fill-brand text-brand" />
          {product.rating.toLocaleString("fa-IR")}
        </span>
      </div>

      <h3 className="text-lg font-bold leading-snug text-ink">
        <Link to="/product/$id" params={{ id: product.id }} className="hover:text-primary">
          {product.name}
        </Link>
      </h3>

      <div className="mt-2 flex items-center gap-3 text-xs text-ink/55">
        <div className="flex gap-1">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="size-4 rounded-full border border-sand"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <span>{product.sizes.slice(0, 4).join("، ")}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          {product.oldPrice && (
            <p className="text-xs text-ink/40 line-through">{formatToman(product.oldPrice)}</p>
          )}
          <p className="text-lg font-black text-primary">
            {formatToman(product.price)}{" "}
            <span className="text-xs font-medium text-ink/50">تومان</span>
          </p>
        </div>
        <button
          onClick={() => add(product.id)}
          disabled={!product.inStock}
          aria-label={`افزودن ${product.name} به سبد`}
          className="btn-golden grid size-10 place-items-center rounded-full transition-transform group-hover:scale-110 disabled:opacity-40"
        >
          <Plus className="size-5" />
        </button>
      </div>
    </article>
  );
}
