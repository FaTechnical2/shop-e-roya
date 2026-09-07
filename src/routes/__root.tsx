import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black text-ink">۴۰۴</h1>
        <h2 className="mt-4 text-xl font-bold text-ink">صفحه پیدا نشد</h2>
        <p className="mt-2 text-sm text-ink/60">
          صفحه‌ای که دنبالش هستید وجود ندارد یا جابه‌جا شده است.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-golden inline-flex rounded-full px-5 py-2.5 text-sm font-bold">
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold tracking-tight text-ink">
          این صفحه بارگذاری نشد
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          مشکلی پیش آمد. می‌توانید دوباره تلاش کنید یا به صفحه اصلی برگردید.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-golden inline-flex rounded-full px-5 py-2.5 text-sm font-bold"
          >
            تلاش دوباره
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-sand px-5 py-2.5 text-sm font-bold text-ink"
          >
            صفحه اصلی
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "گلدن‌کارت | فروشگاه آنلاین عطر و لوازم خانه" },
      {
        name: "description",
        content:
          "گلدن‌کارت، فروشگاه آنلاین عطر، شمع و لوازم خانه با ارسال سریع به سراسر ایران.",
      },
      { property: "og:title", content: "گلدن‌کارت | فروشگاه آنلاین" },
      {
        property: "og:description",
        content: "عطر، شمع و لوازم خانه دست‌چین‌شده با کیفیت لوکس.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;900&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="relative min-h-screen overflow-x-hidden bg-background">
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -top-40 -start-40 size-[720px] rounded-full bg-brand/25 blur-[140px]" />
            <div className="absolute top-1/3 -end-52 size-[520px] rounded-full bg-primary/15 blur-[150px]" />
          </div>
          <Header />
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <Footer />
          <CartDrawer />
          <Toaster position="top-center" />
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}
