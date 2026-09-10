ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS discount_percent integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS offer_label text,
  ADD COLUMN IF NOT EXISTS is_offer boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS offer_until timestamptz;

CREATE TYPE public.order_status AS ENUM ('pending','confirmed','shipped','delivered','cancelled');

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  user_id uuid,
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  subtotal integer NOT NULL DEFAULT 0,
  shipping integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_slug text NOT NULL DEFAULT '',
  product_name text NOT NULL,
  image text NOT NULL DEFAULT '',
  size text NOT NULL DEFAULT '',
  color_name text NOT NULL DEFAULT '',
  color_hex text NOT NULL DEFAULT '',
  unit_price integer NOT NULL DEFAULT 0,
  qty integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();