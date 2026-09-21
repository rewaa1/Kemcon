import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { curtainLayers } from "@/data/curtainLayers";

/**
 * The editorial body of the Curtains page — a Server Component, deliberately.
 *
 * Everything here has to survive in the initial HTML: this is the page that
 * has to answer "who does curtains for a hotel in Egypt" for a crawler and for
 * an answer engine, and none of it may end up behind the enquiry form's
 * hydration gate the way the heading once did.
 *
 * Every claim traces to something already in the repo — `curtainLayers` for the
 * construction, `propertyTypes` for who the enquiry form is built to serve,
 * `treatmentsSection` for the finishes, and the About/Why copy for the factory,
 * the in-house team and the founding architect. Nothing here is invented: no
 * certifications, no rankings, no client names, no numbers that are not already
 * stated elsewhere on the site.
 *
 * Only rendered for a fresh enquiry. With `?edit=` the visitor is amending a
 * line item they already configured, and a page of service copy between them
 * and the form is just something to scroll past.
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

function ContentLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[#c8a45a] underline underline-offset-4 decoration-[#c8a45a]/30 hover:decoration-[#c8a45a] transition-colors"
    >
      {children}
    </Link>
  );
}

/** Who the work is for. Each entry maps to a property type the enquiry accepts. */
const AUDIENCES = [
  {
    en: {
      title: "Hotels & hospitality",
      body: "Guest rooms, suites and public areas, specified once and repeated across a floor or a whole property. Fire-retardant finishing is available where venue codes call for it.",
    },
    ar: {
      title: "الفنادق والضيافة",
      body: "غرف النزلاء والأجنحة والمساحات العامة، تُحدَّد مواصفاتها مرة واحدة وتُنفَّذ على طابق كامل أو على العقار بأكمله. وتتوفر المعالجة المقاومة للحريق حين تشترطها أكواد المنشآت.",
    },
  },
  {
    en: {
      title: "Offices & commercial spaces",
      body: "Workplaces, restaurants and venues, clinics and schools — where light control, privacy and a hygienic finish matter as much as the fabric.",
    },
    ar: {
      title: "المكاتب والمساحات التجارية",
      body: "أماكن العمل والمطاعم والقاعات والعيادات والمدارس — حيث يوازي التحكم في الإضاءة والخصوصية والتشطيب الصحي أهميةَ القماش نفسه.",
    },
  },
  {
    en: {
      title: "Homes",
      body: "Apartments and villas, from a single room to every window in the property, with the same fabrics and the same workshop as our hospitality work.",
    },
    ar: {
      title: "المنازل",
      body: "الشقق والفيلات، من غرفة واحدة إلى كل نافذة في العقار، بالأقمشة نفسها والورشة نفسها التي ننفذ بها أعمال الضيافة.",
    },
  },
  {
    en: {
      title: "Interior designers & architects",
      body: "We can work to a specification you have already drawn up, or develop one with you from scratch — including samples and colour swatches on request.",
    },
    ar: {
      title: "مصممو الديكور والمعماريون",
      body: "يمكننا التنفيذ وفق مواصفات جاهزة لديكم، أو وضعها معكم من البداية — بما في ذلك توفير العينات وخرائط الألوان عند الطلب.",
    },
  },
];

export function CurtainsContent({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const t = <T,>(en: T, ar: T): T => (isAr ? ar : en);
  const align = isAr ? "text-right" : "";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 space-y-14">
      {/* ── What the service actually is ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={t("The service", "الخدمة")} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {t("From specification to installation", "من تحديد المواصفات حتى التركيب")}
          </h2>
          <div
            className={`space-y-4 text-[var(--color-text-muted)] text-base leading-relaxed max-w-3xl ${align}`}
          >
            <p>
              {t(
                "Kemcon owns its factory and keeps the work in-house — sourcing the fabric, weaving and finishing it, tailoring each panel, and hanging it on site. One team is accountable from the first sample to the last curtain fitted, which is why a hotel floor and a single living room come out to the same standard.",
                "تمتلك كيمكون مصنعها الخاص وتُبقي العمل كله داخليًا — من توفير القماش ونسجه وتشطيبه، إلى تفصيل كل قطعة، وتركيبها في الموقع. فريق واحد مسؤول من أول عينة حتى آخر ستارة تُنصب، ولهذا يخرج طابق فندقي كامل وغرفة معيشة واحدة بالمستوى نفسه."
              )}
            </p>
            <p>
              {t(
                "Curtains are made to measure. We can work from your own dimensions or come and measure the windows ourselves, then build the set to open by hand or on a motorised track run from a remote or a wall switch. Where a project calls for it, fabric can be finished with stain protection, fire-retardant or anti-fungal treatments to international standards.",
                "كل ما ننفّذه هو تفصيل ستائر بالمقاس: نعمل بمقاساتكم أو نحضر لقياس النوافذ بأنفسنا، ثم نصنع المجموعة لتُفتح يدويًا أو عبر سكة بمحرك تعمل بريموت أو مفتاح حائط، ونتولّى تركيبها في الموقع. وعند الحاجة، يمكن تشطيب القماش بمعالجات الحماية من البقع أو مقاومة الحريق أو مقاومة الفطريات وفق المعايير الدولية."
              )}
            </p>
          </div>
        </section>
      </FadeIn>

      {/* ── How a curtain is built. Straight from `curtainLayers`. ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={t("Construction", "التكوين")} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {t("Three layers, chosen per room", "ثلاث طبقات تُختار لكل غرفة")}
          </h2>
          <p className={`text-[var(--color-text-muted)] text-base leading-relaxed max-w-3xl ${align}`}>
            {t(
              "A curtain is rarely one piece of fabric. Hotels usually specify all three layers; a flat often takes one or two.",
              "نادرًا ما تكون الستارة قطعة قماش واحدة. تطلب الفنادق عادةً الطبقات الثلاث، بينما تكتفي الشقة غالبًا بطبقة أو اثنتين."
            )}
          </p>
          <ul className="space-y-px">
            {curtainLayers.map((layer) => (
              <li
                key={layer.id}
                className={`border-t border-[var(--color-deep-accent)]/12 pt-4 pb-1 ${align}`}
              >
                <div
                  className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${isAr ? "flex-row-reverse" : ""}`}
                >
                  <h3 className="text-base font-semibold text-[var(--color-heading)]">
                    {isAr ? layer.nameAr : layer.name}
                  </h3>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#c8a45a]">
                    {isAr ? layer.positionAr : layer.position}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-3xl mt-1.5">
                  {isAr ? layer.descriptionAr : layer.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>

      {/* ── Who it is for ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={t("Where we work", "أين نعمل")} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {t("Hotels, workplaces and homes across Egypt", "فنادق ومساحات عمل ومنازل في مصر")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
            {AUDIENCES.map((audience) => {
              const copy = isAr ? audience.ar : audience.en;
              return (
                <div key={copy.title} className={align}>
                  <h3 className="text-sm font-semibold text-[var(--color-heading)] mb-1.5">
                    {copy.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {copy.body}
                  </p>
                </div>
              );
            })}
          </div>

          {/*
            Real anchors — these relationships should be crawlable, not onClick.

            Written out once per language rather than interleaving fragments
            around shared <Link>s: threading Arabic through an English sentence
            skeleton is how you end up with grammatical Arabic words in an
            ungrammatical order.
          */}
          <p
            className={`text-sm text-[var(--color-text-muted)] leading-relaxed pt-2 ${align}`}
          >
            {isAr ? (
              <>
                تعمل على فندق أو منتجع؟ تتناول صفحة{" "}
                <ContentLink href={`/${locale}/services/curtains/hospitality`}>
                  ستائر الفنادق والضيافة
                </ContentLink>{" "}
                غرف النزلاء والأجنحة والبهو والمطاعم بالتفصيل. وتخطّط لعقار كامل؟ اطّلع على{" "}
                <ContentLink href={`/${locale}/services/design-plan`}>
                  التصميم والتخطيط
                </ContentLink>
                . وللتنفيذ على نطاق أوسع، يغطي{" "}
                <ContentLink href={`/${locale}/services/mass-production`}>
                  الإنتاج بكميات كبيرة
                </ContentLink>{" "}
                تجهيز الفنادق بالكامل. ويمكنك تصفّح{" "}
                <ContentLink href={`/${locale}/clients`}>
                  الفنادق التي زودناها
                </ContentLink>{" "}
                كاملةً، أو{" "}
                <ContentLink href={`/${locale}/contact`}>التحدّث إلى فريقنا</ContentLink>{" "}
                لأي استفسار آخر.
              </>
            ) : (
              <>
                Working on a hotel or resort?{" "}
                <ContentLink href={`/${locale}/services/curtains/hospitality`}>
                  Hotel &amp; hospitality curtains
                </ContentLink>{" "}
                covers guest rooms, suites, lobbies and restaurants in detail. Planning a
                whole property? See{" "}
                <ContentLink href={`/${locale}/services/design-plan`}>
                  design &amp; planning
                </ContentLink>
                . Outfitting at scale?{" "}
                <ContentLink href={`/${locale}/services/mass-production`}>
                  Mass production
                </ContentLink>{" "}
                covers hotel-scale runs, and the{" "}
                <ContentLink href={`/${locale}/clients`}>
                  hotels we have supplied
                </ContentLink>{" "}
                are listed in full. For anything else,{" "}
                <ContentLink href={`/${locale}/contact`}>talk to our team</ContentLink>.
              </>
            )}
          </p>
        </section>
      </FadeIn>
    </div>
  );
}
