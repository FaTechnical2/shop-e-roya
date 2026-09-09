import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBasket, User, LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { isAdminQueryOptions } from "@/lib/products.queries";

export function Header() {
  const { totalCount, openCart } = useCart();
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: adminData } = useQuery({ ...isAdminQueryOptions, enabled: Boolean(email) });
  const isAdmin = adminData?.isAdmin === true;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-8 pt-7 lg:px-10">
      <Link to="/" className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-brand to-primary text-lg font-black text-cream shadow-lg shadow-brand/30">
          گ
        </div>
        <div className="leading-tight">
          <p className="text-xl font-black tracking-tight text-ink">گلدن‌کارت</p>
          <p className="text-[11px] tracking-wide text-ink/45">فروشگاه دیجیتال لوکس</p>
        </div>
      </Link>

      <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
        <Link
          to="/"
          className="transition-colors hover:text-primary"
          activeProps={{ className: "font-bold text-primary" }}
          activeOptions={{ exact: true }}
        >
          صفحه اصلی
        </Link>
        <Link
          to="/products"
          className="transition-colors hover:text-primary"
          activeProps={{ className: "font-bold text-primary" }}
        >
          محصولات
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            activeProps={{ className: "font-bold text-primary" }}
          >
            <Settings className="size-4" />
            مدیریت
          </Link>
        )}
      </nav>

      <div className="flex items-center gap-2">
        <button
          onClick={openCart}
          aria-label="سبد خرید"
          className="relative grid size-11 place-items-center rounded-full border border-sand bg-card text-ink transition-colors hover:bg-card/100"
        >
          <ShoppingBasket className="size-5" />
          {totalCount > 0 && (
            <span className="absolute -start-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-cream">
              {totalCount.toLocaleString("fa-IR")}
            </span>
          )}
        </button>
        {email ? (
          <button
            onClick={signOut}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-sand bg-card px-4 text-sm font-bold text-ink transition-colors hover:bg-card/100"
          >
            <LogOut className="size-4" />
            خروج
          </button>
        ) : (
          <Link
            to="/auth"
            className="btn-golden hidden h-11 items-center gap-2 rounded-full px-5 text-sm font-bold sm:inline-flex"
          >
            <User className="size-4" />
            ورود / ثبت‌نام
          </Link>
        )}
      </div>
    </header>
  );
}
