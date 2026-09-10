import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import type { CategoryType } from "@/types/configurator";
import { serviceIntroCopy } from "./introCopy";

/**
 * The eyebrow, `<h1>` and intro that open every service page.
 *
 * A Server Component, deliberately. This markup used to live inside
 * `ProductEnquiryForm`, below its `if (!hydrated) return <skeleton/>` guard —
 * and that guard is always true on the server, because `hydrated` only flips
 * once zustand has read the persisted brief out of `localStorage`. The result
 * was that `/en/services/curtains` shipped 567 bytes of body text, all of it
 * navbar and footer, while the `Product` JSON-LD confidently described a page
 * whose own heading was nowhere in the HTML.
 *
 * Nothing here depends on the store, so none of it needs to wait. `editId`
 * comes from `?edit=` in the URL, which the server already reads to build the
 * page, so even the edit-mode heading resolves without hydration.
 *
 * `FadeIn` still animates it — framer-motion renders children into the HTML
 * and animates from the initial style, so the text is in the document for a
 * crawler on the first byte while a visitor still gets the fade.
 */
export function ServiceIntroHeader({
  category,
  locale,
  editId,
}: {
  category: CategoryType;
  locale: string;
  /** From `?edit=` — swaps the heading and points the back link at the brief. */
  editId?: string;
}) {
  const isAr = locale === "ar";
  const copy = serviceIntroCopy[category];
  const say = (pair: { en: string; ar: string }) => (isAr ? pair.ar : pair.en);

  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full blur-[100px] opacity-[0.08] bg-[#c8a45a]" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <Link
            href={editId ? `/${locale}/services/brief` : `/${locale}/services`}
            className={`inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8 ${isAr ? "flex-row-reverse" : ""}`}
          >
            {isAr ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
            {editId
              ? isAr
                ? "العودة إلى الموجز"
                : "Back to your brief"
              : isAr
                ? "العودة"
                : "Back"}
          </Link>
        </FadeIn>
        <FadeIn direction="up" delay={0.05}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a45a] mb-4">
            {say(copy.eyebrow)}
          </p>
        </FadeIn>
        <FadeIn direction="up" delay={0.1}>
          <h1
            className={`text-4xl md:text-5xl font-bold text-[var(--color-heading)] leading-tight mb-4 ${isAr ? "text-right" : ""}`}
          >
            {say(editId ? copy.editTitle : copy.title)}
          </h1>
        </FadeIn>
        <FadeIn direction="up" delay={0.15}>
          <p
            className={`text-[var(--color-text-muted)] text-base leading-relaxed ${isAr ? "text-right" : ""}`}
          >
            {say(copy.intro)}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
