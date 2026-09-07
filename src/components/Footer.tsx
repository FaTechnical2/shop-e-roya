export function Footer() {
  return (
    <footer className="relative z-10 mx-auto mb-10 mt-16 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-sand px-5 pt-8 text-sm text-ink/50 sm:flex-row lg:px-10">
      <p>© ۱۴۰۴ گلدن‌کارت — ساخته‌شده با دلبستگی</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-primary">
          تماس با ما
        </a>
        <a href="#" className="hover:text-primary">
          سیاست بازگشت
        </a>
        <a href="#" className="hover:text-primary">
          پیگیری سفارش
        </a>
      </div>
    </footer>
  );
}
