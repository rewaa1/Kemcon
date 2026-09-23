import { useTranslations } from "next-intl";

/**
 * Renders a legal document from the translation files.
 *
 * The text lives in `messages/*.json` rather than in JSX so that the English
 * and Arabic versions are guaranteed to have the same sections in the same
 * order — a policy that says something in one language and not the other is
 * worse than one that is merely long.
 *
 * A section may carry `key: "storage"`, which renders the cookie table beneath
 * its heading. That is the one piece of structure a flat list of paragraphs
 * cannot express, and it earns the special case: a table is genuinely the
 * right shape for "name, purpose, lifetime, needs consent".
 */

type Section = { key?: string; heading: string; body: string[] };

export function LegalDocument({ namespace }: { namespace: "privacy" | "terms" }) {
  const t = useTranslations(namespace);
  const sections = t.raw("sections") as Section[];

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:pt-40">
      <header className="mb-12">
        <h1 className="mb-3 text-3xl font-light tracking-tight text-heading md:text-4xl">
          {t("title")}
        </h1>
        <p className="mb-6 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {t("updated")}
        </p>
        <p className="text-base leading-relaxed text-foreground/90">{t("intro")}</p>
      </header>

      <div className="space-y-10">
        {sections.map((section, i) => (
          <section key={`${section.heading}-${i}`}>
            <h2 className="mb-3 text-lg font-medium text-heading">{section.heading}</h2>
            <div className="space-y-3">
              {section.body.map((paragraph, j) => (
                <p key={j} className="text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
            {section.key === "storage" && <StorageTable />}
          </section>
        ))}
      </div>
    </article>
  );
}

/** The cookie table. Only ever rendered inside the privacy policy. */
function StorageTable() {
  const t = useTranslations("privacy");
  const headers = t.raw("storageHeaders") as string[];
  const rows = t.raw("storageRows") as string[][];

  return (
    <>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {t("storageIntro")}
      </p>
      {/* Scrolls within itself: four columns of prose will not fit a phone, and
          the page body must never scroll sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-start text-sm">
          <thead>
            <tr className="border-b border-border">
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="p-3 text-start text-xs font-medium uppercase tracking-[0.1em] text-heading"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-border/60 align-top">
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={
                      i === 0
                        ? "p-3 font-mono text-xs text-foreground"
                        : "p-3 leading-relaxed text-muted-foreground"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
