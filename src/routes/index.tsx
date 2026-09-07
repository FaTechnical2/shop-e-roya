import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { heroPerfume, products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "گلدن‌کارت | فروشگاه عطر، شمع و لوازم خانه" },
      {
        name: "description",
        content:
          "کالکشن آفتاب‌تاب گلدن‌کارت: عطر، شمع، زعفران و لوازم خانه دست‌چین‌شده با تخفیف تا ۴۰٪.",
      },
      { property: "og:title", content: "گلدن‌کارت | کالکشن آفتاب‌تاب" },
      {
        property: "og:description",
        content: "عطرهای گرم و لوازم خانه لوکس، با ارسال سریع به سراسر ایران.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.slice(0, 4);

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-10">
      <section className="relative mb-14 overflow-hidden rounded-[2rem] border border-sand/70 bg-gradient-to-l from-sand via-background to-background">
        <div className="absolute inset-0 bg-gradient-to-tl from-brand/10 to-transparent" />
        <div className="relative grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              ✦ تخفیف پاییزه
            </span>
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-ink md:text-5xl">
              کالکشن
              <br className="hidden md:block" /> آفتاب‌تاب
            </h1>
            <p className="mt-4 max-w-sm leading-relaxed text-ink/60">
              عطرهای گرم و حس‌آمیز، در نور طلایی غروب. تازه‌ترین کالکشن ما با تخفیف تا ۴۰٪.
            </p>
            <Link
              to="/products"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 font-bold text-cream shadow-xl shadow-ink/20 transition-transform hover:-translate-y-0.5"
            >
              مشاهده محصولات <ArrowLeft className="size-4 text-brand" />
            </Link>
          </div>
          <img
            src={heroPerfume}
            alt="بطری‌های عطر کهربایی در نور طلایی غروب"
            width={1080}
            height={1080}
            className="aspect-square w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <section>
        <div className="mb-7 flex items-end justify-between">
          <h2 className="text-2xl font-black tracking-tight text-ink">محصولات منتخب</h2>
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
    </main>
  );
}
