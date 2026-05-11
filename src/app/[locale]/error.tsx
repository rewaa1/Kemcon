"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const isAr = pathname.startsWith("/ar");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center">
            <AlertTriangle size={28} strokeWidth={1.5} className="text-[var(--color-accent)]" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[var(--color-heading)]">
            {isAr ? "حدث خطأ ما" : "Something went wrong"}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            {isAr
              ? "تعذر تحميل هذه الصفحة. يمكنك المحاولة مرة أخرى أو العودة للرئيسية."
              : "This page could not be loaded. You can try again or return to the home page."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-sm text-sm font-semibold bg-[var(--color-accent)] text-[var(--color-dark)] hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            {isAr ? "حاول مرة أخرى" : "Try again"}
          </button>
          <Link
            href={isAr ? "/ar" : "/en"}
            className="px-6 py-2.5 rounded-sm text-sm font-medium border border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-deep-accent)]/50 transition-colors"
          >
            {isAr ? "الرئيسية" : "Go home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
