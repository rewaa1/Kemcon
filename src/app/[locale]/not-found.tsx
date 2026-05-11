import Link from "next/link";
import { getLocale } from "next-intl/server";

export default async function NotFound() {
  const locale = await getLocale();
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--color-accent)]">
            404
          </p>
          <div className="w-8 h-px bg-[var(--color-accent)]/40 mx-auto" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-[var(--color-heading)]">
            {isAr ? "الصفحة غير موجودة" : "Page not found"}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs mx-auto">
            {isAr
              ? "الصفحة التي تبحث عنها غير موجودة أو نُقلت إلى عنوان آخر."
              : "The page you're looking for doesn't exist or has been moved."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="px-6 py-2.5 rounded-sm text-sm font-semibold bg-[var(--color-accent)] text-[var(--color-dark)] hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            {isAr ? "العودة للرئيسية" : "Back to home"}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="px-6 py-2.5 rounded-sm text-sm font-medium border border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-deep-accent)]/50 transition-colors"
          >
            {isAr ? "تصفح المنتجات" : "Browse products"}
          </Link>
        </div>
      </div>
    </div>
  );
}
