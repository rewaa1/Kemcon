"use client";

import { useLocale } from "next-intl";
import { ClipboardList } from "lucide-react";
import { useBriefStore, useBriefItemCount } from "@/lib/brief/store";
import { cn } from "@/lib/utils";

/**
 * The brief affordance in the header — the equivalent of a cart button.
 *
 * Rendered only once the brief holds something. An empty cart icon on every
 * page invited people to open a drawer that had nothing to show and no way to
 * fill it from there; the brief is built on the product pages, so the header
 * should only carry it once there is a brief to carry.
 *
 * That the empty state renders nothing is also what keeps hydration safe:
 * `useBriefItemCount` reports 0 until the persisted store has rehydrated, so
 * the server HTML and the first client pass agree on rendering nothing, and
 * the button appears afterwards only if there really are items.
 */
export function BriefButton({ light = false }: { light?: boolean }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const count = useBriefItemCount();
  const openDrawer = useBriefStore((s) => s.openDrawer);

  const label = isAr ? "الموجز" : "Brief";

  if (count === 0) return null;

  return (
    <button
      onClick={openDrawer}
      aria-label={
        isAr
          ? `${label} — ${count} عنصر`
          : `${label} — ${count} item${count === 1 ? "" : "s"}`
      }
      className={cn(
        "relative inline-flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors duration-300 cursor-pointer",
        light
          ? "text-warm-white/80 hover:text-warm-white"
          : "text-foreground/70 hover:text-accent"
      )}
    >
      <ClipboardList size={16} strokeWidth={1.6} />
      <span className="hidden sm:inline">{label}</span>
      <span
        className="min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-accent)] text-[var(--color-dark)] text-[10px] font-bold flex items-center justify-center tabular-nums"
        aria-hidden="true"
      >
        {count}
      </span>
    </button>
  );
}
