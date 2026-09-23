import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import type { CategoryType } from "@/types/configurator";
import { serviceContent } from "./serviceContentData";

/**
 * The editorial body of a service page — a Server Component, deliberately.
 *
 * Same architecture as the Curtains page it follows: everything here has to be
 * in the initial HTML, because this is what tells a crawler and an answer
 * engine what the service is, and none of it may end up behind the enquiry
 * form's hydration gate the way the headings once did.
 *
 * The copy lives in `serviceContentData.ts` — named apart from this file on
 * purpose, since a case-insensitive filesystem cannot tell `ServiceContent`
 * from `serviceContent` and resolves the import to whichever it finds first.
 * This file is only how that copy is laid out.
 *
 * Curtains keeps its own bespoke version — its middle section renders
 * `curtainLayers` directly, and a page already shipped and verified was not
 * worth disturbing to save one file.
 *
 * Rendered only for a fresh enquiry. With `?edit=` the visitor is amending a
 * line item they already configured, and service copy in front of the form is
 * just something to scroll past.
 */

function Divider({ label, isAr }: { label: string; isAr: boolean }) {
  return (
    <div className={`flex items-center gap-4 ${isAr ? "flex-row-reverse" : ""}`}>
      <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)] flex-shrink-0">
        {label}
      </span>
      <div className="h-px flex-1 bg-[var(--color-deep-accent)]/15" />
    </div>
  );
}

/**
 * The call to action over the enquiry form.
 *
 * This is the heading the page used to open with. Demoting it to an `<h2>`
 * here leaves the `<h1>` free to name the service, without losing the one line
 * that tells a ready visitor what the form below is for.
 */
export function ServiceEnquiryHeading({
  category,
  locale,
}: {
  category: Exclude<CategoryType, "curtains">;
  locale: string;
}) {
  const isAr = locale === "ar";
  const align = isAr ? "text-right" : "";
  const say = (pair: { en: string; ar: string }) => (isAr ? pair.ar : pair.en);
  const content = serviceContent[category];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
      <h2
        className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
      >
        {say(content.enquiryHeading)}
      </h2>
      <p
        className={`text-[var(--color-text-muted)] text-base leading-relaxed max-w-3xl mt-3 ${align}`}
      >
        {say(content.enquiryIntro)}
      </p>
    </div>
  );
}

export function ServiceContent({
  category,
  locale,
}: {
  category: Exclude<CategoryType, "curtains">;
  locale: string;
}) {
  const isAr = locale === "ar";
  const align = isAr ? "text-right" : "";
  const say = (pair: { en: string; ar: string }) => (isAr ? pair.ar : pair.en);
  const content = serviceContent[category];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 space-y-14">
      {/* ── What the service actually is ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={say({ en: "The service", ar: "الخدمة" })} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {say(content.serviceHeading)}
          </h2>
          <div
            className={`space-y-4 text-[var(--color-text-muted)] text-base leading-relaxed max-w-3xl ${align}`}
          >
            {content.serviceBody.map((paragraph) => (
              <p key={paragraph.en}>{say(paragraph)}</p>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── What it is built from ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={say(content.specLabel)} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {say(content.specHeading)}
          </h2>
          {content.specIntro && (
            <p className={`text-[var(--color-text-muted)] text-base leading-relaxed max-w-3xl ${align}`}>
              {say(content.specIntro)}
            </p>
          )}
          <ul className="space-y-px">
            {content.specs.map((spec) => (
              <li
                key={spec.title.en}
                className={`border-t border-[var(--color-deep-accent)]/12 pt-4 pb-1 ${align}`}
              >
                <div
                  className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${isAr ? "flex-row-reverse" : ""}`}
                >
                  <h3 className="text-base font-semibold text-[var(--color-heading)]">
                    {say(spec.title)}
                  </h3>
                  {spec.meta && (
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#c8a45a]">
                      {say(spec.meta)}
                    </span>
                  )}
                </div>
                {spec.body && (
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-3xl mt-1.5">
                    {say(spec.body)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>

      {/* ── Who it is for ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={say({ en: "Where we work", ar: "أين نعمل" })} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {say(content.audienceHeading)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
            {content.audiences.map((audience) => (
              <div key={audience.title.en} className={align}>
                <h3 className="text-sm font-semibold text-[var(--color-heading)] mb-1.5">
                  {say(audience.title)}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {say(audience.body)}
                </p>
              </div>
            ))}
          </div>

          {/*
            Real anchors, so the relationship between services is crawlable
            rather than something only a click can discover. Rendered as a row
            instead of a prose sentence: threading two languages through one
            sentence skeleton is how Arabic ends up in an English word order.
          */}
          <div className={`pt-3 space-y-3 ${align}`}>
            <Divider label={say(content.relatedIntro)} isAr={isAr} />
            <div
              className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${isAr ? "flex-row-reverse" : ""}`}
            >
              {content.related.map((link) => (
                <Link
                  key={link.path}
                  href={`/${locale}${link.path}`}
                  className="text-sm text-[#c8a45a] underline underline-offset-4 decoration-[#c8a45a]/30 hover:decoration-[#c8a45a] transition-colors"
                >
                  {say(link.label)}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
