import heroMenswear from "@/assets/hero-menswear.jpg";
import pShirtOxford from "@/assets/p-shirt-oxford.jpg";
import pFlannel from "@/assets/p-flannel.jpg";
import pTshirtNavy from "@/assets/p-tshirt-navy.jpg";
import pPolo from "@/assets/p-polo.jpg";
import pJeans from "@/assets/p-jeans.jpg";
import pChino from "@/assets/p-chino.jpg";
import pJoggers from "@/assets/p-joggers.jpg";
import pHoodie from "@/assets/p-hoodie.jpg";
import pSweater from "@/assets/p-sweater.jpg";
import pBlazer from "@/assets/p-blazer.jpg";
import pLeatherJacket from "@/assets/p-leather-jacket.jpg";
import pCoat from "@/assets/p-coat.jpg";
import pSneakers from "@/assets/p-sneakers.jpg";
import pBoyTshirt from "@/assets/p-boy-tshirt.jpg";
import pBoyHoodie from "@/assets/p-boy-hoodie.jpg";
import pBoyJeans from "@/assets/p-boy-jeans.jpg";
import pBoyJacket from "@/assets/p-boy-jacket.jpg";
import pBoySet from "@/assets/p-boy-set.jpg";
import pBoySweater from "@/assets/p-boy-sweater.jpg";

export { heroMenswear };

export type Gender = "مردانه" | "پسرانه";

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  gender: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  material: string;
  sizes: string[];
  colors: ColorOption[];
  rating: number;
  stock: number;
  inStock: boolean;
  badge?: string;
}

/** تصاویری که همراه سایت ارسال شده‌اند (محصولات اولیه). */
const bundledImages: Record<string, string> = {
  "hero-menswear.jpg": heroMenswear,
  "p-shirt-oxford.jpg": pShirtOxford,
  "p-flannel.jpg": pFlannel,
  "p-tshirt-navy.jpg": pTshirtNavy,
  "p-polo.jpg": pPolo,
  "p-jeans.jpg": pJeans,
  "p-chino.jpg": pChino,
  "p-joggers.jpg": pJoggers,
  "p-hoodie.jpg": pHoodie,
  "p-sweater.jpg": pSweater,
  "p-blazer.jpg": pBlazer,
  "p-leather-jacket.jpg": pLeatherJacket,
  "p-coat.jpg": pCoat,
  "p-sneakers.jpg": pSneakers,
  "p-boy-tshirt.jpg": pBoyTshirt,
  "p-boy-hoodie.jpg": pBoyHoodie,
  "p-boy-jeans.jpg": pBoyJeans,
  "p-boy-jacket.jpg": pBoyJacket,
  "p-boy-set.jpg": pBoySet,
  "p-boy-sweater.jpg": pBoySweater,
};

export const STORAGE_PREFIX = "storage:";

export function resolveImage(image: string): string {
  if (!image) return "";
  if (image.startsWith(STORAGE_PREFIX)) {
    return `/api/public/product-image/${encodeURIComponent(image.slice(STORAGE_PREFIX.length))}`;
  }
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return bundledImages[image] ?? "";
}

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  gender: string;
  category: string;
  price: number;
  old_price: number | null;
  image: string;
  description: string;
  material: string;
  sizes: string[];
  colors: unknown;
  rating: number | string;
  stock: number;
  badge: string | null;
}

export function rowToProduct(row: ProductRow): Product {
  const colors = Array.isArray(row.colors) ? (row.colors as ColorOption[]) : [];
  return {
    id: row.slug,
    name: row.name,
    brand: row.brand,
    gender: row.gender,
    category: row.category,
    price: row.price,
    ...(row.old_price ? { oldPrice: row.old_price } : {}),
    image: resolveImage(row.image),
    description: row.description,
    material: row.material,
    sizes: row.sizes ?? [],
    colors,
    rating: Number(row.rating),
    stock: row.stock,
    inStock: row.stock > 0,
    ...(row.badge ? { badge: row.badge } : {}),
  };
}

const sizeOrder = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "۳۰",
  "۳۲",
  "۳۴",
  "۳۶",
  "۳۸",
  "۴۰",
  "۴۱",
  "۴۲",
  "۴۳",
  "۴۴",
  "۲ سال",
  "۴ سال",
  "۶ سال",
  "۸ سال",
  "۱۰ سال",
  "۱۲ سال",
];

export interface Facets {
  categories: string[];
  genders: string[];
  brands: string[];
  sizes: string[];
  colors: ColorOption[];
  priceMin: number;
  priceMax: number;
}

export function buildFacets(list: Product[]): Facets {
  const prices = list.map((p) => p.price);
  return {
    categories: Array.from(new Set(list.map((p) => p.category))).filter(Boolean),
    genders: Array.from(new Set(list.map((p) => p.gender))).filter(Boolean),
    brands: Array.from(new Set(list.map((p) => p.brand))).filter(Boolean).sort(),
    sizes: Array.from(new Set(list.flatMap((p) => p.sizes))).sort((a, b) => {
      const ia = sizeOrder.indexOf(a);
      const ib = sizeOrder.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    }),
    colors: Array.from(
      new Map(list.flatMap((p) => p.colors).map((c) => [c.name, c])).values(),
    ),
    priceMin: prices.length ? Math.min(...prices) : 0,
    priceMax: prices.length ? Math.max(...prices) : 10000000,
  };
}

export function formatToman(value: number): string {
  return value.toLocaleString("fa-IR");
}
