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
  gender: Gender;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  material: string;
  sizes: string[];
  colors: ColorOption[];
  rating: number;
  inStock: boolean;
  badge?: string;
}

const C = {
  white: { name: "سفید", hex: "#f7f5f0" },
  cream: { name: "کرم", hex: "#e6d9c0" },
  beige: { name: "بژ", hex: "#cbb392" },
  camel: { name: "شتری", hex: "#c19a6b" },
  navy: { name: "سرمه‌ای", hex: "#25324b" },
  blue: { name: "آبی", hex: "#3f6fa8" },
  black: { name: "مشکی", hex: "#20201f" },
  grey: { name: "طوسی", hex: "#8b8b8b" },
  charcoal: { name: "زغالی", hex: "#4a4a4a" },
  olive: { name: "زیتونی", hex: "#6b7146" },
  green: { name: "سبز", hex: "#4f7a52" },
  brown: { name: "قهوه‌ای", hex: "#7a4b2a" },
  red: { name: "قرمز", hex: "#b8392f" },
  mustard: { name: "خردلی", hex: "#d9a441" },
} satisfies Record<string, ColorOption>;

const TOP_SIZES = ["S", "M", "L", "XL", "XXL"];
const PANT_SIZES = ["۳۰", "۳۲", "۳۴", "۳۶", "۳۸"];
const SHOE_SIZES = ["۴۰", "۴۱", "۴۲", "۴۳", "۴۴"];
const KID_SIZES = ["۲ سال", "۴ سال", "۶ سال", "۸ سال", "۱۰ سال", "۱۲ سال"];

export const products: Product[] = [
  {
    id: "oxford-shirt",
    name: "پیراهن آکسفورد کلاسیک",
    brand: "آرمان",
    gender: "مردانه",
    category: "پیراهن",
    price: 1290000,
    oldPrice: 1690000,
    image: pShirtOxford,
    badge: "پرفروش",
    description:
      "پیراهن آستین‌بلند از پارچه آکسفورد ۱۰۰٪ پنبه با یقه دکمه‌دار. مناسب محیط کار و مهمانی، با فرم استاندارد و دوخت تمیز.",
    material: "۱۰۰٪ پنبه آکسفورد",
    sizes: TOP_SIZES,
    colors: [C.white, C.navy, C.blue],
    rating: 4.7,
    inStock: true,
  },
  {
    id: "flannel-shirt",
    name: "پیراهن پشمی چهارخانه",
    brand: "کوهسار",
    gender: "مردانه",
    category: "پیراهن",
    price: 1450000,
    image: pFlannel,
    description:
      "پیراهن فلانل چهارخانه با بافت نرم و گرم؛ انتخابی راحت برای روزهای سرد پاییز و زمستان.",
    material: "۸۰٪ پنبه، ۲۰٪ پشم",
    sizes: TOP_SIZES,
    colors: [C.blue, C.red, C.green],
    rating: 4.5,
    inStock: true,
  },
  {
    id: "navy-tee",
    name: "تیشرت پنبه‌ای ساده",
    brand: "آرمان",
    gender: "مردانه",
    category: "تیشرت و پولو",
    price: 490000,
    oldPrice: 650000,
    image: pTshirtNavy,
    badge: "تخفیف ۲۵٪",
    description:
      "تیشرت یقه‌گرد از نخ پنبه شانه‌زده با گرماژ ۱۸۰؛ فرم ثابت بعد از شست‌وشو و تنوع رنگ بالا.",
    material: "۱۰۰٪ پنبه پنبه‌ریز",
    sizes: TOP_SIZES,
    colors: [C.navy, C.white, C.black, C.olive],
    rating: 4.6,
    inStock: true,
  },
  {
    id: "pique-polo",
    name: "پولوشرت پیکه",
    brand: "دنیزلی",
    gender: "مردانه",
    category: "تیشرت و پولو",
    price: 790000,
    image: pPolo,
    description:
      "پولوشرت با بافت پیکه خنک، یقه جودون و دو دکمه صدفی. مناسب استفاده روزمره و نیمه‌رسمی.",
    material: "۹۵٪ پنبه، ۵٪ الاستان",
    sizes: TOP_SIZES,
    colors: [C.olive, C.navy, C.white],
    rating: 4.4,
    inStock: true,
  },
  {
    id: "slim-jeans",
    name: "شلوار جین اسلیم",
    brand: "لوتوس",
    gender: "مردانه",
    category: "شلوار",
    price: 1390000,
    image: pJeans,
    description:
      "جین کشی با رنگرزی ایندیگو تیره و فرم اسلیم؛ راحت برای تمام روز و مناسب کفش رسمی یا اسپرت.",
    material: "۹۸٪ پنبه، ۲٪ الاستان",
    sizes: PANT_SIZES,
    colors: [C.navy, C.black, C.blue],
    rating: 4.5,
    inStock: true,
  },
  {
    id: "straight-jeans",
    name: "شلوار جین راسته",
    brand: "لوتوس",
    gender: "مردانه",
    category: "شلوار",
    price: 1290000,
    oldPrice: 1590000,
    image: pJeans,
    badge: "تخفیف",
    description:
      "جین راسته با دمپای ثابت و پارچه سنگین ۱۳ اونس؛ دوامی بالا برای استفاده روزمره.",
    material: "۱۰۰٪ پنبه دنیم",
    sizes: PANT_SIZES,
    colors: [C.blue, C.black],
    rating: 4.3,
    inStock: true,
  },
  {
    id: "chino-pants",
    name: "شلوار کتان چینو",
    brand: "آرمان",
    gender: "مردانه",
    category: "شلوار",
    price: 1150000,
    image: pChino,
    description:
      "شلوار کتان با فرم صاف و جیب‌های ایتالیایی؛ ترکیب خوبی از راحتی و ظاهر مرتب.",
    material: "۹۷٪ پنبه، ۳٪ الاستان",
    sizes: PANT_SIZES,
    colors: [C.beige, C.navy, C.olive],
    rating: 4.6,
    inStock: true,
  },
  {
    id: "joggers",
    name: "شلوار جاگر راحتی",
    brand: "رِسپینا",
    gender: "مردانه",
    category: "شلوار",
    price: 720000,
    image: pJoggers,
    description:
      "شلوار جاگر دو نخ با کمر کشی و بند تنظیم؛ سبک و مناسب ورزش و خانه.",
    material: "۶۰٪ پنبه، ۴۰٪ پلی‌استر",
    sizes: TOP_SIZES,
    colors: [C.grey, C.black, C.navy],
    rating: 4.2,
    inStock: true,
  },
  {
    id: "hoodie",
    name: "هودی سه‌نخ زغالی",
    brand: "رِسپینا",
    gender: "مردانه",
    category: "هودی و سویشرت",
    price: 980000,
    image: pHoodie,
    description:
      "هودی سه‌نخ با داخل کرکی، کلاه دولایه و جیب کانگورویی؛ گرم و سبک.",
    material: "۷۰٪ پنبه، ۳۰٪ پلی‌استر",
    sizes: TOP_SIZES,
    colors: [C.charcoal, C.black, C.cream],
    rating: 4.7,
    inStock: true,
  },
  {
    id: "cable-sweater",
    name: "پلیور بافت کابلی",
    brand: "کوهسار",
    gender: "مردانه",
    category: "پلیور و بافت",
    price: 1350000,
    image: pSweater,
    description:
      "پلیور یقه‌گرد با بافت کابلی درشت از نخ پشم مرینو؛ گرمای بالا بدون سنگینی.",
    material: "۵۰٪ پشم مرینو، ۵۰٪ اکریلیک",
    sizes: TOP_SIZES,
    colors: [C.cream, C.grey, C.navy],
    rating: 4.8,
    inStock: true,
  },
  {
    id: "wool-blazer",
    name: "کت تک پشمی سرمه‌ای",
    brand: "ماکان",
    gender: "مردانه",
    category: "کت و پالتو",
    price: 3450000,
    oldPrice: 4200000,
    image: pBlazer,
    badge: "کالکشن جدید",
    description:
      "کت تک نیم‌آستر با پارچه پشمی، یقه انگلیسی و دو دکمه؛ مناسب مراسم و محیط کار رسمی.",
    material: "۷۰٪ پشم، ۳۰٪ ویسکوز",
    sizes: TOP_SIZES,
    colors: [C.navy, C.charcoal],
    rating: 4.6,
    inStock: true,
  },
  {
    id: "leather-jacket",
    name: "کاپشن چرم قهوه‌ای",
    brand: "ماکان",
    gender: "مردانه",
    category: "کت و پالتو",
    price: 5900000,
    image: pLeatherJacket,
    description:
      "کاپشن چرم طبیعی گوسفندی با آستر ساتن و زیپ فلزی؛ دوخت دست و رنگ‌بندی گرم.",
    material: "چرم طبیعی",
    sizes: TOP_SIZES,
    colors: [C.brown, C.black],
    rating: 4.9,
    inStock: true,
  },
  {
    id: "camel-coat",
    name: "پالتو شتری بلند",
    brand: "ماکان",
    gender: "مردانه",
    category: "کت و پالتو",
    price: 4650000,
    image: pCoat,
    description:
      "پالتو تک‌سینه بلند با پارچه فاستونی پشمی و آستر کامل؛ فرم ایستاده و شانه‌های تمیز.",
    material: "۶۰٪ پشم، ۴۰٪ پلی‌استر",
    sizes: TOP_SIZES,
    colors: [C.camel, C.charcoal],
    rating: 4.7,
    inStock: false,
  },
  {
    id: "white-sneakers",
    name: "کتانی چرم سفید",
    brand: "دنیزلی",
    gender: "مردانه",
    category: "کفش",
    price: 2250000,
    oldPrice: 2650000,
    image: pSneakers,
    badge: "تخفیف",
    description:
      "کتانی مینیمال از چرم طبیعی با زیره لاستیکی و کفی طبی؛ ست شدن آسان با جین و چینو.",
    material: "رویه چرم طبیعی، زیره لاستیک",
    sizes: SHOE_SIZES,
    colors: [C.white, C.black],
    rating: 4.5,
    inStock: true,
  },
  {
    id: "boy-tee",
    name: "تیشرت پسرانه پنبه‌ای",
    brand: "کوچولو",
    gender: "پسرانه",
    category: "تیشرت و پولو",
    price: 320000,
    image: pBoyTshirt,
    description:
      "تیشرت نخی نرم با دوخت تخت و رنگ ثابت؛ راحت برای بازی و مدرسه.",
    material: "۱۰۰٪ پنبه",
    sizes: KID_SIZES,
    colors: [C.red, C.white, C.navy],
    rating: 4.6,
    inStock: true,
  },
  {
    id: "boy-hoodie",
    name: "هودی پسرانه خردلی",
    brand: "کوچولو",
    gender: "پسرانه",
    category: "هودی و سویشرت",
    price: 590000,
    oldPrice: 720000,
    image: pBoyHoodie,
    badge: "تخفیف",
    description:
      "هودی گرم با جیب جلو و کلاه؛ مناسب پاییز و روزهای خنک بهار.",
    material: "۷۵٪ پنبه، ۲۵٪ پلی‌استر",
    sizes: KID_SIZES,
    colors: [C.mustard, C.grey, C.green],
    rating: 4.4,
    inStock: true,
  },
  {
    id: "boy-jeans",
    name: "شلوار جین پسرانه",
    brand: "لوتوس کیدز",
    gender: "پسرانه",
    category: "شلوار",
    price: 680000,
    image: pBoyJeans,
    description:
      "جین کشی با کمر قابل تنظیم؛ مقاوم در برابر شست‌وشوی مکرر.",
    material: "۹۸٪ پنبه، ۲٪ الاستان",
    sizes: KID_SIZES,
    colors: [C.blue, C.navy],
    rating: 4.5,
    inStock: true,
  },
  {
    id: "boy-bomber",
    name: "کاپشن بمبر پسرانه",
    brand: "کوچولو",
    gender: "پسرانه",
    category: "کت و پالتو",
    price: 1180000,
    image: pBoyJacket,
    badge: "پرفروش",
    description:
      "کاپشن بمبر سبک با آستر گرم و زیپ روان؛ ضدباد و مناسب استفاده روزمره.",
    material: "رویه پلی‌استر، آستر گرم",
    sizes: KID_SIZES,
    colors: [C.olive, C.navy, C.black],
    rating: 4.7,
    inStock: true,
  },
  {
    id: "boy-formal-set",
    name: "ست پیراهن و شلوار مجلسی پسرانه",
    brand: "ماکان کیدز",
    gender: "پسرانه",
    category: "ست مجلسی",
    price: 1450000,
    image: pBoySet,
    description:
      "ست پیراهن سفید و شلوار پارچه‌ای سرمه‌ای؛ انتخابی مرتب برای جشن و مراسم.",
    material: "پیراهن پنبه، شلوار فاستونی",
    sizes: KID_SIZES,
    colors: [C.white, C.navy],
    rating: 4.8,
    inStock: true,
  },
  {
    id: "boy-sweater",
    name: "پلیور بافت پسرانه",
    brand: "کوهسار کیدز",
    gender: "پسرانه",
    category: "پلیور و بافت",
    price: 720000,
    image: pBoySweater,
    description:
      "بافت یقه‌گرد با نخ نرم و بدون خارش؛ گرم و سبک برای زیر کاپشن.",
    material: "۵۰٪ پشم، ۵۰٪ اکریلیک",
    sizes: KID_SIZES,
    colors: [C.grey, C.cream, C.navy],
    rating: 4.3,
    inStock: true,
  },
];

const sizeOrder = [...TOP_SIZES, ...PANT_SIZES, ...SHOE_SIZES, ...KID_SIZES];

export const categories = Array.from(new Set(products.map((p) => p.category)));
export const genders: Gender[] = ["مردانه", "پسرانه"];
export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
export const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes))).sort(
  (a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b),
);
export const allColors: ColorOption[] = Array.from(
  new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values(),
);
export const priceBounds = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
};

export function formatToman(value: number): string {
  return value.toLocaleString("fa-IR");
}
