"use client";

import { motion } from "framer-motion";
import { Ruler, Wrench, Radio } from "lucide-react";
import type { ConfiguratorState } from "@/types/configurator";

interface CurtainOptionsStepProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
}

export function CurtainOptionsStep({ state, onChange, locale }: CurtainOptionsStepProps) {
  const isAr = locale === "ar";

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
          {isAr ? "خيارات الستارة" : "Curtain Options"}
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          {isAr
            ? "حدد نوع التحكم وأبعاد الستارة"
            : "Choose control type and curtain dimensions"}
        </p>
      </div>

      {/* Control type */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {isAr ? "نوع التحكم" : "Control Type"}
        </h3>
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          {(["manual", "remote"] as const).map((type) => {
            const isSelected = state.curtainControl === type;
            const label =
              type === "manual"
                ? isAr ? "يدوي" : "Manual"
                : isAr ? "ريموت كنترول" : "Remote Controlled";
            const Icon = type === "manual" ? Wrench : Radio;

            return (
              <motion.button
                key={type}
                onClick={() => onChange({ curtainControl: type })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex flex-col items-center gap-3 p-5 rounded-sm border-2
                  transition-all duration-200
                  ${isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8 text-[var(--color-accent)]"
                    : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)]"
                  }
                `}
              >
                <Icon size={24} strokeWidth={1.5} />
                <span className="text-sm font-medium">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Measurement */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {isAr ? "الأبعاد" : "Dimensions"}
        </h3>

        {/* Measurement visit toggle */}
        <button
          onClick={() =>
            onChange({
              requestMeasurement: !state.requestMeasurement,
              curtainWidth: "",
              curtainHeight: "",
            })
          }
          className={`
            flex items-center gap-3 px-5 py-3 rounded-sm border
            transition-all duration-200 text-sm font-medium
            ${state.requestMeasurement
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8 text-[var(--color-accent)]"
              : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40"
            }
          `}
        >
          <Ruler size={16} />
          {isAr
            ? "طلب زيارة قياس من فريقنا"
            : "Request a measurement visit from our team"}
        </button>

        {/* Size inputs */}
        {!state.curtainControl && (
        <p className="text-xs text-[var(--color-text-muted)] italic">
          {isAr ? "* اختر نوع التحكم للمتابعة" : "* Select a control type to continue"}
        </p>
      )}

      {!state.requestMeasurement && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-4 max-w-xs"
          >
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--color-text-muted)] font-medium">
                {isAr ? "العرض (سم)" : "Width (cm)"}
              </label>
              <input
                type="number"
                min="30"
                max="2000"
                value={state.curtainWidth}
                onChange={(e) => onChange({ curtainWidth: e.target.value })}
                placeholder="e.g. 150"
                className="w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--color-text-muted)] font-medium">
                {isAr ? "الارتفاع (سم)" : "Height (cm)"}
              </label>
              <input
                type="number"
                min="30"
                max="1200"
                value={state.curtainHeight}
                onChange={(e) => onChange({ curtainHeight: e.target.value })}
                placeholder="e.g. 280"
                className="w-full px-3 py-2.5 rounded-sm bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
