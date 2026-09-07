import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "ورود و ثبت‌نام | گلدن‌کارت" },
      {
        name: "description",
        content: "به حساب کاربری گلدن‌کارت وارد شوید یا حساب جدید بسازید.",
      },
      { property: "og:title", content: "ورود و ثبت‌نام | گلدن‌کارت" },
      { property: "og:description", content: "ورود با ایمیل یا حساب گوگل به فروشگاه گلدن‌کارت." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("حساب شما ساخته شد. خوش آمدید!");
        navigate({ to: "/" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("خوش آمدید!");
        navigate({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("ورود با گوگل انجام نشد");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <main className="relative z-10 mx-auto w-full max-w-md px-5 pb-16">
      <div className="rounded-[2rem] border border-sand/70 bg-card p-8">
        <h1 className="text-2xl font-black tracking-tight text-ink">
          {mode === "login" ? "ورود به حساب" : "ساخت حساب جدید"}
        </h1>
        <p className="mt-2 text-sm text-ink/55">
          برای پیگیری سفارش‌ها و ذخیره علاقه‌مندی‌ها وارد شوید.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="email" className="text-xs font-medium text-ink/60">
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-sand bg-background px-4 py-3 text-left text-sm text-ink outline-none focus:border-brand"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-medium text-ink/60">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-sand bg-background px-4 py-3 text-left text-sm text-ink outline-none focus:border-brand"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-golden w-full rounded-full py-3.5 text-sm font-bold disabled:opacity-60"
          >
            {loading ? "لطفاً صبر کنید…" : mode === "login" ? "ورود" : "ثبت‌نام"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-ink/40">
          <span className="h-px flex-1 bg-sand" />
          یا
          <span className="h-px flex-1 bg-sand" />
        </div>

        <button
          onClick={googleSignIn}
          className="w-full rounded-full border border-sand bg-background py-3.5 text-sm font-bold text-ink transition-colors hover:bg-sand/50"
        >
          ورود با حساب گوگل
        </button>

        <p className="mt-6 text-center text-xs text-ink/55">
          {mode === "login" ? "حساب ندارید؟" : "قبلاً ثبت‌نام کرده‌اید؟"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="font-bold text-primary hover:underline"
          >
            {mode === "login" ? "ثبت‌نام کنید" : "وارد شوید"}
          </button>
        </p>
      </div>
    </main>
  );
}
