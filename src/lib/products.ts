import heroPerfume from "@/assets/hero-perfume.jpg";
import productPerfume from "@/assets/product-perfume.jpg";
import productCandle from "@/assets/product-candle.jpg";
import productBrass from "@/assets/product-brass.jpg";
import productBeeswax from "@/assets/product-beeswax.jpg";
import productDiffuser from "@/assets/product-diffuser.jpg";
import productSaffron from "@/assets/product-saffron.jpg";
import productHoney from "@/assets/product-honey.jpg";
import productSoap from "@/assets/product-soap.jpg";

export { heroPerfume };

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "aftabtab",
    name: "عطر آفتاب‌تاب",
    category: "عطر",
    price: 1740000,
    oldPrice: 2900000,
    image: productPerfume,
    badge: "تخفیف ۴۰٪",
    description:
      "ترکیبی گرم از کهربا، چوب صندل و وانیل؛ عطری که مثل نور طلایی غروب روی پوست می‌نشیند. مناسب برای روزهای خنک پاییزی.",
  },
  {
    id: "oud-candle",
    name: "شمع عود طلایی",
    category: "شمع",
    price: 890000,
    image: productCandle,
    description:
      "شمع دست‌ساز با رایحه عود و عنبر در ظرف سرامیکی. بیش از ۴۰ ساعت سوخت آرام و یکنواخت.",
  },
  {
    id: "brass-holder",
    name: "شمع‌دان برنجی",
    category: "لوازم خانگی",
    price: 1250000,
    image: productBrass,
    description:
      "شمع‌دان برنجی دست‌ساز با پرداخت آینه‌ای. نور شمع را به شکلی گرم و زنده منعکس می‌کند.",
  },
  {
    id: "saffron-wax",
    name: "موم زعفرانی",
    category: "موم طبیعی",
    price: 650000,
    image: productBeeswax,
    description:
      "رول موم طبیعی زنبور با عطر ملایم زعفران؛ برای شمع‌سازی یا استفاده مستقیم.",
  },
  {
    id: "amber-diffuser",
    name: "دیفیوزر کهربا",
    category: "عطر",
    price: 980000,
    oldPrice: 1200000,
    image: productDiffuser,
    badge: "تخفیف",
    description:
      "دیفیوزر نی‌ای با اسانس کهربا و چوب؛ بدون نیاز به شعله، فضای خانه را تا ۸ هفته معطر نگه می‌دارد.",
  },
  {
    id: "royal-saffron",
    name: "زعفران سرگل",
    category: "خوراکی",
    price: 480000,
    image: productSaffron,
    description:
      "یک گرم زعفران سرگل درجه یک قائنات، بسته‌بندی‌شده در شیشه مهر و مومشده.",
  },
  {
    id: "golden-honey",
    name: "عسل آفتابگردان",
    category: "خوراکی",
    price: 540000,
    image: productHoney,
    description:
      "عسل طبیعی آفتابگردان با بافتی نرم و طعمی ملایم؛ همراه با میله چوبی سرو.",
  },
  {
    id: "amber-soap",
    name: "مایع دست کهربایی",
    category: "لوازم خانگی",
    price: 320000,
    image: productSoap,
    description:
      "مایع دست با عصاره کهربا و روغن آرگان؛ پاک‌کننده ملایم با رایحه‌ای گرم و ماندگار.",
  },
];

export const categories = ["همه", ...Array.from(new Set(products.map((p) => p.category)))];

export function formatToman(value: number): string {
  return value.toLocaleString("fa-IR");
}
