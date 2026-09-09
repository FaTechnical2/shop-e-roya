CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.grant_admin_to_allowlisted()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'mygeneral1400@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_to_allowlisted();

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE lower(email) = 'mygeneral1400@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  brand text NOT NULL DEFAULT '',
  gender text NOT NULL DEFAULT 'مردانه',
  category text NOT NULL DEFAULT '',
  price integer NOT NULL DEFAULT 0,
  old_price integer,
  image text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  material text NOT NULL DEFAULT '',
  sizes text[] NOT NULL DEFAULT '{}',
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  rating numeric NOT NULL DEFAULT 5,
  stock integer NOT NULL DEFAULT 0,
  badge text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.products (slug, name, brand, gender, category, price, old_price, image, description, material, sizes, colors, rating, stock, badge, sort_order) VALUES
('oxford-shirt', 'پیراهن آکسفورد کلاسیک', 'آرمان', 'مردانه', 'پیراهن', 1290000, 1690000, 'p-shirt-oxford.jpg', 'پیراهن آستین‌بلند از پارچه آکسفورد ۱۰۰٪ پنبه با یقه دکمه‌دار. مناسب محیط کار و مهمانی، با فرم استاندارد و دوخت تمیز.', '۱۰۰٪ پنبه آکسفورد', ARRAY['S','M','L','XL','XXL']::text[], '[{"name":"سفید","hex":"#f7f5f0"},{"name":"سرمه‌ای","hex":"#25324b"},{"name":"آبی","hex":"#3f6fa8"}]'::jsonb, 4.7, 12, 'پرفروش', 0),
('flannel-shirt', 'پیراهن پشمی چهارخانه', 'کوهسار', 'مردانه', 'پیراهن', 1450000, NULL, 'p-flannel.jpg', 'پیراهن فلانل چهارخانه با بافت نرم و گرم؛ انتخابی راحت برای روزهای سرد پاییز و زمستان.', '۸۰٪ پنبه، ۲۰٪ پشم', ARRAY['S','M','L','XL','XXL']::text[], '[{"name":"آبی","hex":"#3f6fa8"},{"name":"قرمز","hex":"#b8392f"},{"name":"سبز","hex":"#4f7a52"}]'::jsonb, 4.5, 12, NULL, 1),
('navy-tee', 'تیشرت پنبه‌ای ساده', 'آرمان', 'مردانه', 'تیشرت و پولو', 490000, 650000, 'p-tshirt-navy.jpg', 'تیشرت یقه‌گرد از نخ پنبه شانه‌زده با گرماژ ۱۸۰؛ فرم ثابت بعد از شست‌وشو و تنوع رنگ بالا.', '۱۰۰٪ پنبه پنبه‌ریز', ARRAY['S','M','L','XL','XXL']::text[], '[{"name":"سرمه‌ای","hex":"#25324b"},{"name":"سفید","hex":"#f7f5f0"},{"name":"مشکی","hex":"#20201f"},{"name":"زیتونی","hex":"#6b7146"}]'::jsonb, 4.6, 12, 'تخفیف ۲۵٪', 2),
('pique-polo', 'پولوشرت پیکه', 'دنیزلی', 'مردانه', 'تیشرت و پولو', 790000, NULL, 'p-polo.jpg', 'پولوشرت با بافت پیکه خنک، یقه جودون و دو دکمه صدفی. مناسب استفاده روزمره و نیمه‌رسمی.', '۹۵٪ پنبه، ۵٪ الاستان', ARRAY['S','M','L','XL','XXL']::text[], '[{"name":"زیتونی","hex":"#6b7146"},{"name":"سرمه‌ای","hex":"#25324b"},{"name":"سفید","hex":"#f7f5f0"}]'::jsonb, 4.4, 12, NULL, 3),
('slim-jeans', 'شلوار جین اسلیم', 'لوتوس', 'مردانه', 'شلوار', 1390000, NULL, 'p-jeans.jpg', 'جین کشی با رنگرزی ایندیگو تیره و فرم اسلیم؛ راحت برای تمام روز و مناسب کفش رسمی یا اسپرت.', '۹۸٪ پنبه، ۲٪ الاستان', ARRAY['۳۰','۳۲','۳۴','۳۶','۳۸']::text[], '[{"name":"سرمه‌ای","hex":"#25324b"},{"name":"مشکی","hex":"#20201f"},{"name":"آبی","hex":"#3f6fa8"}]'::jsonb, 4.5, 12, NULL, 4),
('straight-jeans', 'شلوار جین راسته', 'لوتوس', 'مردانه', 'شلوار', 1290000, 1590000, 'p-jeans.jpg', 'جین راسته با دمپای ثابت و پارچه سنگین ۱۳ اونس؛ دوامی بالا برای استفاده روزمره.', '۱۰۰٪ پنبه دنیم', ARRAY['۳۰','۳۲','۳۴','۳۶','۳۸']::text[], '[{"name":"آبی","hex":"#3f6fa8"},{"name":"مشکی","hex":"#20201f"}]'::jsonb, 4.3, 12, 'تخفیف', 5),
('chino-pants', 'شلوار کتان چینو', 'آرمان', 'مردانه', 'شلوار', 1150000, NULL, 'p-chino.jpg', 'شلوار کتان با فرم صاف و جیب‌های ایتالیایی؛ ترکیب خوبی از راحتی و ظاهر مرتب.', '۹۷٪ پنبه، ۳٪ الاستان', ARRAY['۳۰','۳۲','۳۴','۳۶','۳۸']::text[], '[{"name":"بژ","hex":"#cbb392"},{"name":"سرمه‌ای","hex":"#25324b"},{"name":"زیتونی","hex":"#6b7146"}]'::jsonb, 4.6, 12, NULL, 6),
('joggers', 'شلوار جاگر راحتی', 'رِسپینا', 'مردانه', 'شلوار', 720000, NULL, 'p-joggers.jpg', 'شلوار جاگر دو نخ با کمر کشی و بند تنظیم؛ سبک و مناسب ورزش و خانه.', '۶۰٪ پنبه، ۴۰٪ پلی‌استر', ARRAY['S','M','L','XL','XXL']::text[], '[{"name":"طوسی","hex":"#8b8b8b"},{"name":"مشکی","hex":"#20201f"},{"name":"سرمه‌ای","hex":"#25324b"}]'::jsonb, 4.2, 12, NULL, 7),
('hoodie', 'هودی سه‌نخ زغالی', 'رِسپینا', 'مردانه', 'هودی و سویشرت', 980000, NULL, 'p-hoodie.jpg', 'هودی سه‌نخ با داخل کرکی، کلاه دولایه و جیب کانگورویی؛ گرم و سبک.', '۷۰٪ پنبه، ۳۰٪ پلی‌استر', ARRAY['S','M','L','XL','XXL']::text[], '[{"name":"زغالی","hex":"#4a4a4a"},{"name":"مشکی","hex":"#20201f"},{"name":"کرم","hex":"#e6d9c0"}]'::jsonb, 4.7, 12, NULL, 8),
('cable-sweater', 'پلیور بافت کابلی', 'کوهسار', 'مردانه', 'پلیور و بافت', 1350000, NULL, 'p-sweater.jpg', 'پلیور یقه‌گرد با بافت کابلی درشت از نخ پشم مرینو؛ گرمای بالا بدون سنگینی.', '۵۰٪ پشم مرینو، ۵۰٪ اکریلیک', ARRAY['S','M','L','XL','XXL']::text[], '[{"name":"کرم","hex":"#e6d9c0"},{"name":"طوسی","hex":"#8b8b8b"},{"name":"سرمه‌ای","hex":"#25324b"}]'::jsonb, 4.8, 12, NULL, 9),
('wool-blazer', 'کت تک پشمی سرمه‌ای', 'ماکان', 'مردانه', 'کت و پالتو', 3450000, 4200000, 'p-blazer.jpg', 'کت تک نیم‌آستر با پارچه پشمی، یقه انگلیسی و دو دکمه؛ مناسب مراسم و محیط کار رسمی.', '۷۰٪ پشم، ۳۰٪ ویسکوز', ARRAY['S','M','L','XL','XXL']::text[], '[{"name":"سرمه‌ای","hex":"#25324b"},{"name":"زغالی","hex":"#4a4a4a"}]'::jsonb, 4.6, 12, 'کالکشن جدید', 10),
('leather-jacket', 'کاپشن چرم قهوه‌ای', 'ماکان', 'مردانه', 'کت و پالتو', 5900000, NULL, 'p-leather-jacket.jpg', 'کاپشن چرم طبیعی گوسفندی با آستر ساتن و زیپ فلزی؛ دوخت دست و رنگ‌بندی گرم.', 'چرم طبیعی', ARRAY['S','M','L','XL','XXL']::text[], '[{"name":"قهوه‌ای","hex":"#7a4b2a"},{"name":"مشکی","hex":"#20201f"}]'::jsonb, 4.9, 12, NULL, 11),
('camel-coat', 'پالتو شتری بلند', 'ماکان', 'مردانه', 'کت و پالتو', 4650000, NULL, 'p-coat.jpg', 'پالتو تک‌سینه بلند با پارچه فاستونی پشمی و آستر کامل؛ فرم ایستاده و شانه‌های تمیز.', '۶۰٪ پشم، ۴۰٪ پلی‌استر', ARRAY['S','M','L','XL','XXL']::text[], '[{"name":"شتری","hex":"#c19a6b"},{"name":"زغالی","hex":"#4a4a4a"}]'::jsonb, 4.7, 0, NULL, 12),
('white-sneakers', 'کتانی چرم سفید', 'دنیزلی', 'مردانه', 'کفش', 2250000, 2650000, 'p-sneakers.jpg', 'کتانی مینیمال از چرم طبیعی با زیره لاستیکی و کفی طبی؛ ست شدن آسان با جین و چینو.', 'رویه چرم طبیعی، زیره لاستیک', ARRAY['۴۰','۴۱','۴۲','۴۳','۴۴']::text[], '[{"name":"سفید","hex":"#f7f5f0"},{"name":"مشکی","hex":"#20201f"}]'::jsonb, 4.5, 12, 'تخفیف', 13),
('boy-tee', 'تیشرت پسرانه پنبه‌ای', 'کوچولو', 'پسرانه', 'تیشرت و پولو', 320000, NULL, 'p-boy-tshirt.jpg', 'تیشرت نخی نرم با دوخت تخت و رنگ ثابت؛ راحت برای بازی و مدرسه.', '۱۰۰٪ پنبه', ARRAY['۲ سال','۴ سال','۶ سال','۸ سال','۱۰ سال','۱۲ سال']::text[], '[{"name":"قرمز","hex":"#b8392f"},{"name":"سفید","hex":"#f7f5f0"},{"name":"سرمه‌ای","hex":"#25324b"}]'::jsonb, 4.6, 12, NULL, 14),
('boy-hoodie', 'هودی پسرانه خردلی', 'کوچولو', 'پسرانه', 'هودی و سویشرت', 590000, 720000, 'p-boy-hoodie.jpg', 'هودی گرم با جیب جلو و کلاه؛ مناسب پاییز و روزهای خنک بهار.', '۷۵٪ پنبه، ۲۵٪ پلی‌استر', ARRAY['۲ سال','۴ سال','۶ سال','۸ سال','۱۰ سال','۱۲ سال']::text[], '[{"name":"خردلی","hex":"#d9a441"},{"name":"طوسی","hex":"#8b8b8b"},{"name":"سبز","hex":"#4f7a52"}]'::jsonb, 4.4, 12, 'تخفیف', 15),
('boy-jeans', 'شلوار جین پسرانه', 'لوتوس کیدز', 'پسرانه', 'شلوار', 680000, NULL, 'p-boy-jeans.jpg', 'جین کشی با کمر قابل تنظیم؛ مقاوم در برابر شست‌وشوی مکرر.', '۹۸٪ پنبه، ۲٪ الاستان', ARRAY['۲ سال','۴ سال','۶ سال','۸ سال','۱۰ سال','۱۲ سال']::text[], '[{"name":"آبی","hex":"#3f6fa8"},{"name":"سرمه‌ای","hex":"#25324b"}]'::jsonb, 4.5, 12, NULL, 16),
('boy-bomber', 'کاپشن بمبر پسرانه', 'کوچولو', 'پسرانه', 'کت و پالتو', 1180000, NULL, 'p-boy-jacket.jpg', 'کاپشن بمبر سبک با آستر گرم و زیپ روان؛ ضدباد و مناسب استفاده روزمره.', 'رویه پلی‌استر، آستر گرم', ARRAY['۲ سال','۴ سال','۶ سال','۸ سال','۱۰ سال','۱۲ سال']::text[], '[{"name":"زیتونی","hex":"#6b7146"},{"name":"سرمه‌ای","hex":"#25324b"},{"name":"مشکی","hex":"#20201f"}]'::jsonb, 4.7, 12, 'پرفروش', 17),
('boy-formal-set', 'ست پیراهن و شلوار مجلسی پسرانه', 'ماکان کیدز', 'پسرانه', 'ست مجلسی', 1450000, NULL, 'p-boy-set.jpg', 'ست پیراهن سفید و شلوار پارچه‌ای سرمه‌ای؛ انتخابی مرتب برای جشن و مراسم.', 'پیراهن پنبه، شلوار فاستونی', ARRAY['۲ سال','۴ سال','۶ سال','۸ سال','۱۰ سال','۱۲ سال']::text[], '[{"name":"سفید","hex":"#f7f5f0"},{"name":"سرمه‌ای","hex":"#25324b"}]'::jsonb, 4.8, 12, NULL, 18),
('boy-sweater', 'پلیور بافت پسرانه', 'کوهسار کیدز', 'پسرانه', 'پلیور و بافت', 720000, NULL, 'p-boy-sweater.jpg', 'بافت یقه‌گرد با نخ نرم و بدون خارش؛ گرم و سبک برای زیر کاپشن.', '۵۰٪ پشم، ۵۰٪ اکریلیک', ARRAY['۲ سال','۴ سال','۶ سال','۸ سال','۱۰ سال','۱۲ سال']::text[], '[{"name":"طوسی","hex":"#8b8b8b"},{"name":"کرم","hex":"#e6d9c0"},{"name":"سرمه‌ای","hex":"#25324b"}]'::jsonb, 4.3, 12, NULL, 19);