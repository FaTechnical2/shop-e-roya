import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Ruler, Truck, Undo2 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { heroMenswear } from "@/lib/products";
import { productRowsQueryOptions, useProducts } from "@/lib/products.queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "گلدن‌کارت | فروشگاه پوشاک مردانه و پسرانه" },
      {
        name: "description",
        content:
          "خرید آنلاین پوشاک مردانه و پسرانه: پیراهن، تیشرت، شلوار، هودی، کت و پالتو با جستجو و فیلتر سایز و رنگ.",
      },
      { property: "og:title", content: "گلدن‌کارت | پوشاک مردانه و پسرانه" },
      {
        property: "og:description",
        content: "کالکشن پاییز و زمستان برای پدر و پسر، با ارسال سریع به سراسر ایران.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productRowsQueryOptions),
  component: Index,
});

function Index() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.badge).slice(0, 4);
  const boys = products.filter((p) => p.gender === "پسرانه").slice(0, 4);

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-10">
      <section className="relative mb-14 overflow-hidden rounded-[2rem] border border-sand/70 bg-gradient-to-l from-sand via-background to-background">
        <div className="absolute inset-0 bg-gradient-to-tl from-brand/10 to-transparent" />
        <div className="relative grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              ✦ کالکشن پاییز و زمستان
            </span>
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-ink md:text-5xl">
              پوشاک مردانه
              <br className="hidden md:block" /> و پسرانه
            </h1>
            <p className="mt-4 max-w-sm leading-relaxed text-ink/60">
              از پیراهن و جین تا پالتو و کت تک؛ برای پدر و پسر، با سایزبندی کامل و رنگ‌های
              دست‌چین‌شده.
            </p>
            <Link
              to="/products"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 font-bold text-cream shadow-xl shadow-ink/20 transition-transform hover:-translate-y-0.5"
            >
              مشاهده محصولات <ArrowLeft className="size-4 text-brand" />
            </Link>
          </div>
          <img
            src={heroMenswear}
            alt="مرد با پالتو شتری و پسربچه با کاپشن جین در نور طلایی"
            width={1280}
            height={1280}
            className="aspect-square w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <section className="mb-14 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Truck, title: "ارسال سریع", text: "ارسال رایگان بالای ۲٬۰۰۰٬۰۰۰ تومان" },
          { icon: Ruler, title: "سایزبندی کامل", text: "از S تا XXL و سایز کودک ۲ تا ۱۲ سال" },
          { icon: Undo2, title: "بازگشت ۷ روزه", text: "تعویض سایز رایگان در تهران" },
        ].map((f) => (
          <div key={f.title} className="card-glass flex items-center gap-3 rounded-2xl p-4">
            <f.icon className="size-6 text-brand" />
            <div>
              <p className="text-sm font-bold text-ink">{f.title}</p>
              <p className="text-xs text-ink/60">{f.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-14">
        <div className="mb-7 flex items-end justify-between">
          <h2 className="text-2xl font-black tracking-tight text-ink">منتخب مردانه</h2>
          <Link to="/products" className="text-sm font-bold text-primary hover:underline">
            همه محصولات ←
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-7 flex items-end justify-between">
          <h2 className="text-2xl font-black tracking-tight text-ink">پسرانه</h2>
          <Link to="/products" className="text-sm font-bold text-primary hover:underline">
            همه محصولات ←
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {boys.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
