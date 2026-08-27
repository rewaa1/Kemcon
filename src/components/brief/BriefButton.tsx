"use client";

import { useLocale } from "next-intl";
import { ClipboardList } from "lucide-react";
import { useBriefStore, useBriefItemCount } from "@/lib/brief/store";
import { cn } from "@/lib/utils";

/**
 * The brief affordance in the header — the equivalent of a cart button.
 *
 * The count renders as 0 until the persisted store has rehydrated, so the
 * server HTML and the first client render agree. Without that guard this is
 * the component that would produce a hydration mismatch on every page.
 */
export function BriefButton({ light = false }: { light?: boolean }) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const count = useBriefItemCount();
  const openDrawer = useBriefStore((s) => s.openDrawer);

  const label = isAr ? "الموجز" : "Brief";

  return (
    <button
      onClick={openDrawer}
      aria-label={
        count > 0
          ? isAr
            ? `${label} — ${count} عنصر`
            : `${label} — ${count} item${count === 1 ? "" : "s"}`
          : label
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
      {count > 0 && (
        <span
          className="min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-accent)] text-[var(--color-dark)] text-[10px] font-bold flex items-center justify-center tabular-nums"
          aria-hidden="true"
        >
          {count}
        </span>
      )}
    </button>
  );
}
