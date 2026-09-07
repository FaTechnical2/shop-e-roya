import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatToman, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className="card-glass group rounded-3xl p-4">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative mb-4 block"
      >
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
      </Link>
      <p className="mb-1 text-xs font-bold text-brand">{product.category}</p>
      <h3 className="text-lg font-bold leading-snug text-ink">
        <Link to="/product/$id" params={{ id: product.id }} className="hover:text-primary">
          {product.name}
        </Link>
      </h3>
      <div className="mt-3 flex items-center justify-between">
        <div>
          {product.oldPrice && (
            <p className="text-xs text-ink/40 line-through">
              {formatToman(product.oldPrice)}
            </p>
          )}
          <p className="text-lg font-black text-primary">
            {formatToman(product.price)}{" "}
            <span className="text-xs font-medium text-ink/50">تومان</span>
          </p>
        </div>
        <button
          onClick={() => add(product.id)}
          aria-label={`افزودن ${product.name} به سبد`}
          className="btn-golden grid size-10 place-items-center rounded-full transition-transform group-hover:scale-110"
        >
          <Plus className="size-5" />
        </button>
      </div>
    </article>
  );
}
