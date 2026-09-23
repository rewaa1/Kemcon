import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { curtainLayers } from "@/data/curtainLayers";

/**
 * The editorial body of the hospitality curtains page — a Server Component.
 *
 * Same architecture as `/services/curtains`: everything here reaches the
 * initial HTML, because this page exists to answer "who supplies curtains to
 * hotels in Egypt" for a crawler, an answer engine, and a procurement buyer who
 * will not wait for JavaScript.
 *
 * **Every claim traces to something already in the repository.** The three
 * layers come from `curtainLayers`; the treatments from `treatmentsSection` and
 * the About copy ("Stain Protection, Fire Proof, and Anti-Fungus"); measurement
 * and installation from the enquiry form's measurement section and the "one
 * team from the first sketch to the final installation" positioning; the
 * hospitality areas from the audience copy already written for curtains, chairs
 * and bed covers (guest rooms, suites, lobbies, restaurants, banqueting halls).
 *
 * Deliberately **no hotel counts**. The repository states two different figures
 * — "100+ Hotels Served" on About and "100+ Egypt Hotels Served" on Clients —
 * and guessing which is right is not this page's job. It links to the client
 * list instead, which is the verifiable artefact.
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

/** Where curtains go inside a property. Each area appears in existing site copy. */
const AREAS = [
  {
    en: {
      title: "Guest rooms",
      body: "The repeatable case: one specification, cut to the window type and run across a floor or the whole property. Usually all three layers, with blackout lining doing the work.",
    },
    ar: {
      title: "غرف النزلاء",
      body: "الحالة الأكثر تكرارًا: مواصفة واحدة تُفصَّل على نوع النافذة وتُنفَّذ على طابق كامل أو على العقار بأكمله. وغالبًا بالطبقات الثلاث، وتقع المهمة الأساسية على بطانة العتمة.",
    },
  },
  {
    en: {
      title: "Suites",
      body: "Larger openings and taller drops, often with a heavier decorative layer and a motorised track so a full wall of curtain can be drawn from a switch.",
    },
    ar: {
      title: "الأجنحة",
      body: "فتحات أوسع وارتفاعات أكبر، وغالبًا بطبقة ديكورية أثقل وسكة بمحرك، ليُسحب جدار كامل من الستائر بضغطة مفتاح.",
    },
  },
  {
    en: {
      title: "Lobbies & public areas",
      body: "Where the fabric is seen before anything else. Decorative drapery carries the scheme, and the finish has to survive constant footfall and daylight.",
    },
    ar: {
      title: "البهو والمساحات العامة",
      body: "حيث يُرى القماش قبل أي شيء آخر. تحمل الطبقة الديكورية طابع التصميم، وعلى التشطيب أن يتحمل الحركة الدائمة وضوء النهار.",
    },
  },
  {
    en: {
      title: "Restaurants & banqueting halls",
      body: "Light control matters through the day and into the evening, and fabric here is treated for the requirements that apply to public venues.",
    },
    ar: {
      title: "المطاعم وقاعات الولائم",
      body: "يهم التحكم في الإضاءة طوال النهار وحتى المساء، ويُعالَج القماش هنا بما يوافق الاشتراطات المطبقة على الأماكن العامة.",
    },
  },
];

/** Finishes, exactly as offered in the enquiry form and stated on the About page. */
const TREATMENTS = [
  {
    en: {
      title: "Fire-retardant",
      meta: "burn-treated",
      body: "Flame-resistant treatment, required by most hotel and public-venue codes.",
    },
    ar: {
      title: "مقاومة الحريق",
      meta: "معالجة ضد اللهب",
      body: "معالجة مقاومة للهب، تشترطها معظم أكواد الفنادق والأماكن العامة.",
    },
  },
  {
    en: {
      title: "Anti-fungal & antibacterial",
      meta: "hygienic finish",
      body: "A hygienic finish on the fabric — usual for hospitals, clinics and schools, and specified in hospitality where hygiene standards call for it.",
    },
    ar: {
      title: "مضادة للفطريات والبكتيريا",
      meta: "تشطيب صحي",
      body: "تشطيب صحي على القماش — معتاد في المستشفيات والعيادات والمدارس، ويُطلب في الضيافة حين تقتضيه معايير النظافة.",
    },
  },
  {
    en: {
      title: "Stain protection",
      meta: "high-use areas",
      body: "Applied where fabric sits in reach of guests and traffic. Offered alongside the other finishes to international standards.",
    },
    ar: {
      title: "الحماية من البقع",
      meta: "المناطق كثيفة الاستخدام",
      body: "تُطبَّق حيث يكون القماش في متناول النزلاء وحركة المرور. وتُقدَّم إلى جانب باقي التشطيبات وفق المعايير الدولية.",
    },
  },
];

/** How a project actually runs, from the enquiry flow and the in-house positioning. */
const PROCESS = [
  {
    en: {
      title: "Specification",
      body: "Fabric, layers, colour and pattern are settled against the scheme. Samples and colour swatches are provided on request, and we can work to a specification you already hold.",
    },
    ar: {
      title: "تحديد المواصفات",
      body: "يُحسم القماش والطبقات واللون والنمط بما يوافق التصميم. وتُوفَّر العينات وخرائط الألوان عند الطلب، ويمكننا التنفيذ وفق مواصفات جاهزة لديكم.",
    },
  },
  {
    en: {
      title: "Measurement",
      body: "Work from your own dimensions, or ask us to come and measure. Curtains are cut to the opening rather than to a standard size.",
    },
    ar: {
      title: "القياس",
      body: "نعمل بمقاساتكم، أو نحضر للقياس بأنفسنا. وتُفصَّل الستائر على الفتحة نفسها لا على مقاس قياسي.",
    },
  },
  {
    en: {
      title: "Manufacture & installation",
      body: "Made in Kemcon's own factory and hung by the same team — from fabric sourcing and production through tailoring to on-site installation, with no third party in between.",
    },
    ar: {
      title: "التصنيع والتركيب",
      body: "تُصنع في مصنع كيمكون ويتولى الفريق نفسه تركيبها — من توفير القماش والتصنيع مرورًا بالتفصيل حتى التركيب في الموقع، دون وسيط.",
    },
  },
];

export function HospitalityContent({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const align = isAr ? "text-right" : "";
  const t = <T,>(en: T, ar: T): T => (isAr ? ar : en);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 space-y-14">
      {/* ── The service ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={t("The service", "الخدمة")} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {t("One supplier, from fabric to fitted", "مورد واحد، من القماش حتى التركيب")}
          </h2>
          <div
            className={`space-y-4 text-[var(--color-text-muted)] text-base leading-relaxed ${align}`}
          >
            <p>
              {t(
                "Kemcon supplies curtains to hotels and resorts in Egypt as a project rather than a purchase. Fabric is sourced and produced in our own factory, tailored to the openings it will hang in, finished to the treatments the property requires, and installed on site by the same team. No third parties sit between the specification and the fitted curtain.",
                "تورّد كيمكون الستائر للفنادق والمنتجعات في مصر بوصفها مشروعًا لا عملية شراء. يُوفَّر القماش ويُنتج في مصنعنا، ويُفصَّل على الفتحات التي سيُعلَّق فيها، ويُشطَّب بالمعالجات التي يتطلبها العقار، ثم يتولى الفريق نفسه تركيبه في الموقع. ولا يقف أي وسيط بين المواصفة والستارة المركَّبة."
              )}
            </p>
            <p>
              {t(
                "That single line of accountability is what makes a floor of guest rooms come out matching. One specification is cut, repeated to the room count, and hung to the same standard in every room — which is the part that usually goes wrong when sourcing, making and fitting are split across three companies.",
                "وهذا التسلسل الواحد للمسؤولية هو ما يجعل طابقًا كاملًا من غرف النزلاء يخرج متطابقًا. تُفصَّل مواصفة واحدة، وتُكرَّر بعدد الغرف، وتُركَّب بالمستوى نفسه في كل غرفة — وهو تحديدًا ما يختل عادةً حين تتوزع مهام التوريد والتصنيع والتركيب على ثلاث شركات."
              )}
            </p>
          </div>
        </section>
      </FadeIn>

      {/* ── Construction, straight from `curtainLayers` ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={t("Construction", "التكوين")} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {t("The three layers a hotel curtain is built from", "الطبقات الثلاث التي تُبنى منها ستارة الفندق")}
          </h2>
          <p className={`text-[var(--color-text-muted)] text-base leading-relaxed ${align}`}>
            {t(
              "Hotels almost always specify all three. Each does a different job, and the blackout lining is usually the one a guest notices.",
              "تطلب الفنادق عادةً الطبقات الثلاث. لكل طبقة وظيفة مختلفة، وبطانة العتمة هي التي يلاحظها النزيل غالبًا."
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
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mt-1.5">
                  {isAr ? layer.descriptionAr : layer.description}
                </p>
              </li>
            ))}
          </ul>
          <p className={`text-sm text-[var(--color-text-muted)] leading-relaxed ${align}`}>
            {t(
              "Curtains are drawn by hand, or run on a motorised track from a remote or a wall switch.",
              "تُسحب الستائر يدويًا، أو تعمل على سكة بمحرك عبر ريموت أو مفتاح حائط."
            )}
          </p>
        </section>
      </FadeIn>

      {/* ── Where they go ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={t("Applications", "التطبيقات")} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {t("Where they go in a property", "أين تُركَّب داخل العقار")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
            {AREAS.map((area) => {
              const copy = isAr ? area.ar : area.en;
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
        </section>
      </FadeIn>

      {/* ── Finishing ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={t("Finishing", "التشطيب")} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {t("Treatments to international standards", "معالجات وفق المعايير الدولية")}
          </h2>
          <ul className="space-y-px">
            {TREATMENTS.map((treatment) => {
              const copy = isAr ? treatment.ar : treatment.en;
              return (
                <li
                  key={copy.title}
                  className={`border-t border-[var(--color-deep-accent)]/12 pt-4 pb-1 ${align}`}
                >
                  <div
                    className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${isAr ? "flex-row-reverse" : ""}`}
                  >
                    <h3 className="text-base font-semibold text-[var(--color-heading)]">
                      {copy.title}
                    </h3>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#c8a45a]">
                      {copy.meta}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mt-1.5">
                    {copy.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </FadeIn>

      {/* ── How a project runs ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={t("How it runs", "كيف يسير المشروع")} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {t("Specification, measurement, installation", "المواصفة، القياس، التركيب")}
          </h2>
          <div className="space-y-6">
            {PROCESS.map((step, i) => {
              const copy = isAr ? step.ar : step.en;
              return (
                <div
                  key={copy.title}
                  className={`flex gap-4 ${isAr ? "flex-row-reverse text-right" : ""}`}
                >
                  <span className="text-[11px] font-semibold text-[#c8a45a] tabular-nums pt-1 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--color-heading)] mb-1.5">
                      {copy.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {copy.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </FadeIn>

      {/* ── Who we work with ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={t("Who we work with", "من نعمل معهم")} isAr={isAr} />
          <h2
            className={`text-2xl md:text-3xl font-bold text-[var(--color-heading)] leading-snug ${align}`}
          >
            {t("Hotels, resorts and the people who specify for them", "الفنادق والمنتجعات ومن يضعون مواصفاتها")}
          </h2>
          <p
            className={`text-[var(--color-text-muted)] text-base leading-relaxed ${align}`}
          >
            {isAr ? (
              <>
                نعمل مباشرةً مع الفنادق والمنتجعات، ومع المطاعم والقاعات، ومع مصممي
                الديكور والمعماريين الذين يضعون مواصفات مشاريع الضيافة. وتجد{" "}
                <ContentLink href={`/${locale}/clients`}>
                  الفنادق والمنتجعات التي زودناها
                </ContentLink>{" "}
                مدرجةً بالاسم.
              </>
            ) : (
              <>
                We work directly with hotels and resorts, with restaurants and venues, and
                with the interior designers and architects who specify hospitality
                projects. The{" "}
                <ContentLink href={`/${locale}/clients`}>
                  hotels and resorts we have supplied
                </ContentLink>{" "}
                are listed by name.
              </>
            )}
          </p>
        </section>
      </FadeIn>

      {/* ── Related + enquiry ── */}
      <FadeIn direction="up">
        <section className="space-y-5">
          <Divider label={t("Next", "الخطوة التالية")} isAr={isAr} />
          <div
            className={`glass-card rounded-sm p-7 md:p-8 space-y-5 ${align}`}
          >
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-heading)] leading-snug">
              {t("Start a hotel curtain enquiry", "ابدأ طلب ستائر للفندق")}
            </h2>
            <p className="text-[var(--color-text-muted)] text-base leading-relaxed">
              {t(
                "Tell us the property, the rooms and the layers you need. If the scheme is not settled yet, our team can plan it with you.",
                "أخبرنا بالعقار وعدد الغرف والطبقات المطلوبة. وإن لم يكن التصميم قد استقر بعد، يمكن لفريقنا وضعه معك."
              )}
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-3 pt-1 ${isAr ? "sm:flex-row-reverse" : ""}`}
            >
              <Link
                href={`/${locale}/services/curtains`}
                className="inline-flex items-center justify-center h-12 px-8 rounded-sm text-sm font-medium tracking-[0.12em] uppercase bg-[#c8a45a] text-[#1A1D24] hover:bg-[#d4b26a] transition-colors"
              >
                {t("Specify your curtains", "حدّد مواصفات ستائرك")}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center h-12 px-8 rounded-sm text-sm font-medium tracking-[0.12em] uppercase border border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-deep-accent)]/50 transition-colors"
              >
                {t("Talk to our team", "تحدّث إلى فريقنا")}
              </Link>
            </div>
          </div>

          <div
            className={`flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 ${isAr ? "flex-row-reverse" : ""} ${align}`}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
              {t("Related", "ذات صلة")}
            </span>
            <ContentLink href={`/${locale}/services/curtains`}>
              {t("All curtain solutions", "كل حلول الستائر")}
            </ContentLink>
            <ContentLink href={`/${locale}/services/mass-production`}>
              {t("Mass production", "الإنتاج بكميات كبيرة")}
            </ContentLink>
            <ContentLink href={`/${locale}/services/design-plan`}>
              {t("Design & planning", "التصميم والتخطيط")}
            </ContentLink>
            <ContentLink href={`/${locale}/services/bed-covers`}>
              {t("Hotel bed covers", "مفارش الفنادق")}
            </ContentLink>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
