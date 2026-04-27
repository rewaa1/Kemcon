"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ArrowRight, ArrowLeft } from "lucide-react";
import { fabrics, fabricFamilies } from "@/data/fabrics";
import { colors } from "@/data/colors";
import { patterns } from "@/data/patterns";
import type { ConfiguratorState } from "@/types/configurator";

const FABRIC_VISUALS: Record<string, string> = {
  velvet: "rich pile velvet with deep light absorption and lustrous sheen",
  linen: "natural linen with subtle woven texture and organic relaxed drape",
  silk: "smooth silk with fluid drape and soft iridescent sheen",
  cotton: "crisp cotton with clean structured lines and matte finish",
  jacquard: "jacquard with intricate raised woven motifs and dimensional texture",
  chenille: "soft chenille with velvety pile texture and gentle warmth",
  brocade: "brocade with ornate raised pattern and fine metallic thread detail",
  sheer: "translucent sheer fabric gently diffusing natural light",
  blackout: "heavyweight blackout fabric with dense opaque weave",
  wool: "textured wool with warm matte finish and natural flowing drape",
  suede: "suede-effect fabric with soft nap and warm tactile quality",
  synthetic: "technical synthetic blend with refined texture and controlled drape",
};

const PATTERN_VISUALS: Record<string, string> = {
  Solid: "in a clean solid color with no pattern",
  Striped: "with elegant vertical stripes",
  Herringbone: "in a classic herringbone weave",
  Checkered: "with a refined checkered motif",
  Geometric: "with bold geometric motifs",
  Damask: "with ornate damask medallion pattern",
  Floral: "with delicate floral embroidery",
  Paisley: "with intricate paisley motifs",
  Abstract: "with expressive abstract pattern",
  Moroccan: "with traditional Moroccan arabesque motifs",
};

interface AIVisualizationStepProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
  onNext: () => void;
}

type TabGenState = "idle" | "loading" | "done" | "error";
type Tab = "room" | "detail";

export function AIVisualizationStep({
  state,
  onChange,
  locale,
  onNext,
}: AIVisualizationStepProps) {
  const isAr = locale === "ar";

  const [activeTab, setActiveTab] = useState<Tab>("room");
  const [roomState, setRoomState] = useState<TabGenState>("idle");
  const [detailState, setDetailState] = useState<TabGenState>("idle");
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [detailUrl, setDetailUrl] = useState<string | null>(null);
  const [roomRegen, setRoomRegen] = useState(0);
  const [detailRegen, setDetailRegen] = useState(0);

  const fabric = fabrics.find((f) => f.id === state.fabricId);
  const color = colors.find((c) => c.id === state.colorId);
  const pattern = patterns.find((p) => p.id === state.patternId);
  const family = fabricFamilies.find((f) => f.id === fabric?.familyId);

  const fabricVisual = FABRIC_VISUALS[family?.id ?? ""] ?? `${fabric?.name ?? "fabric"} curtain fabric`;
  const patternVisual = PATTERN_VISUALS[pattern?.name ?? ""] ?? "solid color";
  const colorName = color?.name ?? "neutral";

  const NEGATIVE = "blurry, low quality, cartoon, illustration, watermark, ugly, distorted, oversaturated, deformed, text, logo";

  const buildRoomPrompt = () =>
    [
      "editorial interior design photograph",
      `luxury penthouse living room with floor-to-ceiling ${fabricVisual} curtains`,
      `${patternVisual} in ${colorName}`,
      "tall ceilings with crown molding, marble floors",
      "warm golden afternoon light streaming through windows",
      "sophisticated furniture, high-end interior styling",
      "shot on Canon EOS R5, 35mm lens, f/2.8",
      "no people, 8K ultra-detailed",
    ].join(", ");

  const buildDetailPrompt = () =>
    [
      "luxury textile macro photography",
      `close-up of ${fabricVisual} ${patternVisual} in ${colorName}`,
      "soft directional studio lighting highlighting fabric texture and natural drape",
      "shot on Canon EOS R5, 100mm macro lens, f/4",
      "crisp fabric detail, professional product photography",
      "no people, 8K ultra-detailed",
    ].join(", ");

  const fetchImage = async (prompt: string, seed: number) => {
    const response = await fetch("/api/generate-curtain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, seed, negative: NEGATIVE }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const pollinationsUrl = response.headers.get("X-Image-Url");
    const blob = await response.blob();
    return { blobUrl: URL.createObjectURL(blob), pollinationsUrl };
  };

  const generateRoom = async (isRegen = false) => {
    setRoomState("loading");
    setRoomUrl(null);
    if (isRegen) setRoomRegen((r) => r + 1);
    try {
      const { blobUrl, pollinationsUrl } = await fetchImage(buildRoomPrompt(), Math.floor(Math.random() * 9999999));
      setRoomUrl(blobUrl);
      onChange({ aiImageUrl: pollinationsUrl, aiDisplayUrl: blobUrl });
      setRoomState("done");
    } catch {
      setRoomState("error");
    }
  };

  const generateDetail = async (isRegen = false) => {
    setDetailState("loading");
    setDetailUrl(null);
    if (isRegen) setDetailRegen((r) => r + 1);
    try {
      const { blobUrl, pollinationsUrl } = await fetchImage(buildDetailPrompt(), Math.floor(Math.random() * 9999999));
      setDetailUrl(blobUrl);
      // Room view takes priority as the shared URL; detail only becomes primary if room was never generated
      if (!roomUrl) onChange({ aiImageUrl: pollinationsUrl, aiDisplayUrl: blobUrl });
      else onChange({ aiDisplayUrl: blobUrl });
      setDetailState("done");
    } catch {
      setDetailState("error");
    }
  };

  const anyDone = roomState === "done" || detailState === "done";

  const tabs: { id: Tab; label: string; labelAr: string }[] = [
    { id: "room", label: "Room View", labelAr: "منظر الغرفة" },
    { id: "detail", label: "Fabric Detail", labelAr: "تفاصيل القماش" },
  ];

  const tabGenState = activeTab === "room" ? roomState : detailState;
  const tabUrl = activeTab === "room" ? roomUrl : detailUrl;
  const tabRegen = activeTab === "room" ? roomRegen : detailRegen;
  const onGenerate = activeTab === "room" ? generateRoom : generateDetail;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
          {isAr ? "شاهد ستائرك" : "See Your Curtains"}
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm">
          {isAr
            ? "اختر المشهد الذي تريد توليده"
            : "Choose a view to generate — each takes about 15 seconds"}
        </p>
      </div>

      {/* Specs recap */}
      <div className="flex flex-wrap justify-center gap-2">
        {fabric && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)]">
            {isAr ? fabric.nameAr : fabric.name}
          </span>
        )}
        {color && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)]">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color.hex }} />
            {isAr ? color.nameAr : color.name}
          </span>
        )}
        {pattern && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-deep-accent)]/30 text-[var(--color-text)]">
            {isAr ? pattern.nameAr : pattern.name}
          </span>
        )}
      </div>

      {/* Tabs + image area */}
      <div className="w-full max-w-2xl mx-auto space-y-0">

        {/* Tab buttons */}
        <div className="flex rounded-t-sm overflow-hidden border border-b-0 border-[var(--color-deep-accent)]/20">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isDone = tab.id === "room" ? roomState === "done" : detailState === "done";
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 py-3 text-xs font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5
                  ${isActive
                    ? "bg-[var(--color-accent)] text-[var(--color-dark)]"
                    : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }
                `}
              >
                {isDone && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[var(--color-dark)]/50" : "bg-[var(--color-accent)]"}`} />
                )}
                {isAr ? tab.labelAr : tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="relative border border-[var(--color-deep-accent)]/20 rounded-b-sm overflow-hidden h-[480px] bg-[var(--color-surface)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* Idle */}
              {tabGenState === "idle" && (
                <div className="flex flex-col items-center gap-4 px-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <Sparkles size={22} className="text-[var(--color-accent)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {activeTab === "room"
                        ? (isAr ? "توليد منظر الغرفة" : "Generate Room View")
                        : (isAr ? "توليد تفاصيل القماش" : "Generate Fabric Detail")}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {isAr ? "حوالي 15 ثانية" : "About 15 seconds"}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => onGenerate(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[var(--color-accent)] text-[var(--color-dark)] text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
                  >
                    <Sparkles size={15} />
                    {isAr ? "توليد" : "Generate"}
                  </motion.button>
                </div>
              )}

              {/* Loading */}
              {tabGenState === "loading" && (
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="w-10 h-10 rounded-full border-2 border-[var(--color-accent)] border-t-transparent"
                  />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {isAr ? "جارٍ التوليد..." : "Generating..."}
                  </p>
                </div>
              )}

              {/* Error */}
              {tabGenState === "error" && (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-red-400">
                    {isAr ? "فشل التوليد" : "Generation failed"}
                  </p>
                  <button
                    onClick={() => onGenerate(false)}
                    className="flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline"
                  >
                    <RefreshCw size={14} />
                    {isAr ? "إعادة المحاولة" : "Retry"}
                  </button>
                </div>
              )}

              {/* Done — image */}
              {tabGenState === "done" && tabUrl && (
                <>
                  <img
                    src={tabUrl}
                    alt={activeTab === "room" ? "Room view render" : "Fabric detail render"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 flex items-end justify-between">
                    <p className="text-[10px] text-white/60">
                      {isAr ? "صورة توليدية للإلهام" : "AI-generated inspiration render"}
                    </p>
                    {tabRegen < 2 && (
                      <button
                        onClick={() => onGenerate(true)}
                        className="flex items-center gap-1.5 text-[10px] text-white/70 hover:text-white transition-colors"
                      >
                        <RefreshCw size={11} />
                        {isAr ? `توليد جديد (${2 - tabRegen} متبقي)` : `Regenerate (${2 - tabRegen} left)`}
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Continue / Skip */}
      <div className={`flex items-center ${anyDone ? "justify-between" : "justify-center"} max-w-2xl mx-auto`}>
        {!anyDone && (
          <button
            onClick={onNext}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2"
          >
            {isAr ? "متابعة بدون معاينة ←" : "Continue without preview →"}
          </button>
        )}
        {anyDone && (
          <>
            <button
              onClick={onNext}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2"
            >
              {isAr ? "تخطي ←" : "Skip →"}
            </button>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[var(--color-accent)] text-[var(--color-dark)] text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors ${isAr ? "flex-row-reverse" : ""}`}
            >
              {isAr ? "التالي" : "Continue"}
              {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
