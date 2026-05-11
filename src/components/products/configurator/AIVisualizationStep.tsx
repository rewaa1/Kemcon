"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, ArrowRight, ArrowLeft, Images, AlertCircle } from "lucide-react";
import { fabrics, fabricFamilies } from "@/data/fabrics";
import { colors } from "@/data/colors";
import { patterns } from "@/data/patterns";
import type { CategoryType, ConfiguratorState } from "@/types/configurator";
import { InspirationGallery } from "@/components/shared/InspirationGallery";

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
  category: CategoryType;
}

type TabGenState = "idle" | "loading" | "done" | "error";
type GenerationError = "rate-limited" | "unavailable" | "network";
type Tab = "room" | "detail";
type Mode = "ai" | "gallery";

export function AIVisualizationStep({
  state,
  onChange,
  locale,
  onNext,
  category,
}: AIVisualizationStepProps) {
  const isAr = locale === "ar";
  const [mode, setMode] = useState<Mode | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>("room");
  const [roomState, setRoomState] = useState<TabGenState>("idle");
  const [detailState, setDetailState] = useState<TabGenState>("idle");
  const [roomError, setRoomError] = useState<GenerationError | null>(null);
  const [detailError, setDetailError] = useState<GenerationError | null>(null);
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

  const buildRoomPrompt = () => {
    const base = "photorealistic interior design photograph";
    const outro = "no people, ultra-detailed, hyperrealistic";
    if (category === "chairs") {
      return [
        base,
        `luxury hotel suite featuring an armchair upholstered in ${colorName} ${fabricVisual} ${patternVisual}`,
        "armchair is the clear focal point, warm golden afternoon light, refined hotel setting",
        outro,
      ].join(", ");
    }
    if (category === "sofas") {
      return [
        base,
        `luxury hotel lounge featuring a sofa upholstered in ${colorName} ${fabricVisual} ${patternVisual}`,
        "sofa is the clear focal point filling the frame, warm golden afternoon light, grand hotel interior",
        outro,
      ].join(", ");
    }
    return [
      base,
      `luxury hotel suite with floor-to-ceiling ${colorName} ${fabricVisual} curtains ${patternVisual}`,
      "curtains are the clear focal point filling the frame, beautifully gathered with natural flowing drape",
      "tall arched windows, warm golden afternoon light, understated elegant interior",
      outro,
    ].join(", ");
  };

  const buildDetailPrompt = () =>
    [
      "professional textile product photography",
      `extreme close-up of ${colorName} ${fabricVisual} ${patternVisual}`,
      "sharp crisp fabric texture, soft even studio lighting, gentle natural drape folds",
      "neutral background, no people, ultra-detailed, hyperrealistic",
    ].join(", ");

  const fetchImage = async (prompt: string, seed: number) => {
    let response: Response;
    try {
      response = await fetch("/api/generate-curtain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, seed, negative: NEGATIVE }),
      });
    } catch {
      throw new Error("network");
    }
    if (response.status === 429) throw new Error("rate-limited");
    if (!response.ok) throw new Error("unavailable");
    const pollinationsUrl = response.headers.get("X-Image-Url");
    const blob = await response.blob();
    return { blobUrl: URL.createObjectURL(blob), pollinationsUrl };
  };

  const generateRoom = async (isRegen = false) => {
    setRoomState("loading");
    setRoomError(null);
    setRoomUrl(null);
    if (isRegen) setRoomRegen((r) => r + 1);
    try {
      const { blobUrl, pollinationsUrl } = await fetchImage(buildRoomPrompt(), Math.floor(Math.random() * 9999999));
      setRoomUrl(blobUrl);
      onChange({ aiImageUrl: pollinationsUrl, aiDisplayUrl: blobUrl });
      setRoomState("done");
    } catch (err) {
      setRoomError((err as Error).message as GenerationError);
      setRoomState("error");
    }
  };

  const generateDetail = async (isRegen = false) => {
    setDetailState("loading");
    setDetailError(null);
    setDetailUrl(null);
    if (isRegen) setDetailRegen((r) => r + 1);
    try {
      const { blobUrl, pollinationsUrl } = await fetchImage(buildDetailPrompt(), Math.floor(Math.random() * 9999999));
      setDetailUrl(blobUrl);
      // Always store detail URL; room view takes priority for the display thumbnail
      if (!roomUrl) onChange({ aiDetailImageUrl: pollinationsUrl, aiDisplayUrl: blobUrl });
      else onChange({ aiDetailImageUrl: pollinationsUrl });
      setDetailState("done");
    } catch (err) {
      setDetailError((err as Error).message as GenerationError);
      setDetailState("error");
    }
  };

  const anyDone = roomState === "done" || detailState === "done";

  const tabError = activeTab === "room" ? roomError : detailError;

  const errorMessage = (err: GenerationError | null) => {
    if (err === "rate-limited")
      return isAr
        ? "وصلت إلى الحد الأقصى للطلبات. انتظر دقيقة ثم أعد المحاولة."
        : "You've reached the generation limit. Wait a minute then try again.";
    if (err === "network")
      return isAr
        ? "تعذّر الاتصال بخدمة الذكاء الاصطناعي. تحقق من اتصالك بالإنترنت."
        : "Couldn't reach the AI service. Check your connection and try again.";
    return isAr
      ? "خدمة الذكاء الاصطناعي غير متاحة مؤقتًا. يمكنك إعادة المحاولة أو تصفح معرض مشاريعنا."
      : "The AI service is temporarily unavailable. Try again or browse our portfolio instead.";
  };

  const toggleInspirationImage = (src: string) => {
    const next = state.inspirationImages.includes(src)
      ? state.inspirationImages.filter((s) => s !== src)
      : [...state.inspirationImages, src];
    onChange({ inspirationImages: next });
  };

  const tabs: { id: Tab; label: string; labelAr: string }[] = [
    { id: "room", label: "Room View", labelAr: "منظر الغرفة" },
    { id: "detail", label: "Fabric Detail", labelAr: "تفاصيل القماش" },
  ];

  const tabGenState = activeTab === "room" ? roomState : detailState;
  const tabUrl = activeTab === "room" ? roomUrl : detailUrl;
  const tabRegen = activeTab === "room" ? roomRegen : detailRegen;
  const onGenerate = activeTab === "room" ? generateRoom : generateDetail;

  if (!mode) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
            {isAr ? "تصوّر تصميمك" : "Visualize Your Design"}
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            {isAr
              ? "اختر طريقة لاستلهام تصميمك"
              : "Choose how you'd like to explore your design"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            onClick={() => setMode("ai")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-4 p-8 rounded-sm border border-[var(--color-deep-accent)]/30 hover:border-[var(--color-accent)]/60 bg-[var(--color-surface)] transition-all duration-200 text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center group-hover:bg-[var(--color-accent)]/20 transition-colors">
              <Sparkles size={22} className="text-[var(--color-accent)]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--color-heading)]">
                {isAr ? "توليد بالذكاء الاصطناعي" : "AI Generation"}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isAr
                  ? category === "chairs"
                    ? "شاهد كرسيك في غرفة فاخرة مُولَّدة بالذكاء الاصطناعي"
                    : category === "sofas"
                    ? "شاهد أريكتك في غرفة فاخرة مُولَّدة بالذكاء الاصطناعي"
                    : "شاهد ستائرك في غرفة فاخرة مُولَّدة بالذكاء الاصطناعي"
                  : category === "chairs"
                  ? "See your chair in an AI-generated luxury room"
                  : category === "sofas"
                  ? "See your sofa in an AI-generated luxury room"
                  : "See your curtains in an AI-generated luxury room"}
              </p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => setMode("gallery")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-4 p-8 rounded-sm border border-[var(--color-deep-accent)]/30 hover:border-[var(--color-accent)]/60 bg-[var(--color-surface)] transition-all duration-200 text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center group-hover:bg-[var(--color-accent)]/20 transition-colors">
              <Images size={22} className="text-[var(--color-accent)]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--color-heading)]">
                {isAr ? "استلهم من مشاريعنا" : "Browse Our Portfolio"}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isAr
                  ? "اختر صورًا من فنادق نفّذناها كمرجع لتصميمك"
                  : "Pick photos from hotels we've furnished as design inspiration"}
              </p>
            </div>
          </motion.button>
        </div>

        <div className="text-center">
          <button
            onClick={onNext}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2"
          >
            {isAr ? "تخطي ←" : "Skip this step →"}
          </button>
        </div>
      </div>
    );
  }

  if (mode === "gallery") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
              {isAr ? "استلهم من مشاريعنا" : "Browse Our Portfolio"}
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm">
              {isAr
                ? "اختر حتى 5 صور كمرجع لتصميمك — ستُضاف إلى استفسارك"
                : "Select up to 5 images as design references — they'll be included in your inquiry"}
            </p>
          </div>
          <button
            onClick={() => setMode(null)}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2 shrink-0 ml-4"
          >
            {isAr ? "← رجوع" : "← Back"}
          </button>
        </div>

        <InspirationGallery
          selected={state.inspirationImages}
          onSelect={toggleInspirationImage}
          maxSelect={5}
          isAr={isAr}
        />

        <div className={`flex items-center ${state.inspirationImages.length > 0 ? "justify-between" : "justify-center"} pt-2`}>
          <button
            onClick={onNext}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2"
          >
            {isAr ? "تخطي ←" : "Skip →"}
          </button>
          {state.inspirationImages.length > 0 && (
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[var(--color-accent)] text-[var(--color-dark)] text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors ${isAr ? "flex-row-reverse" : ""}`}
            >
              {isAr ? `التالي (${state.inspirationImages.length} صور)` : `Continue (${state.inspirationImages.length} selected)`}
              {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </motion.button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="text-center flex-1 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)]">
            {isAr
              ? category === "chairs"
                ? "شاهد كرسيك"
                : category === "sofas"
                ? "شاهد أريكتك"
                : "شاهد ستائرك"
              : category === "chairs"
              ? "See Your Chair"
              : category === "sofas"
              ? "See Your Sofa"
              : "See Your Curtains"}
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm">
            {isAr
              ? "اختر المشهد الذي تريد توليده"
              : "Choose a view to generate — each takes about 15 seconds"}
          </p>
        </div>
        <button
          onClick={() => setMode(null)}
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2 shrink-0 mt-1"
        >
          {isAr ? "← رجوع" : "← Back"}
        </button>
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
                <div className="flex flex-col items-center gap-5 px-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle size={22} className="text-red-400" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-[var(--color-heading)]">
                      {isAr ? "تعذّر توليد الصورة" : "Generation unavailable"}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] max-w-xs">
                      {errorMessage(tabError)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <motion.button
                      onClick={() => onGenerate(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-5 py-2 rounded-sm bg-[var(--color-accent)] text-[var(--color-dark)] text-xs font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
                    >
                      <RefreshCw size={13} />
                      {isAr ? "إعادة المحاولة" : "Try again"}
                    </motion.button>
                    <button
                      onClick={() => setMode("gallery")}
                      className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-2"
                    >
                      <Images size={13} />
                      {isAr ? "تصفح معرض مشاريعنا" : "Browse our portfolio"}
                    </button>
                  </div>
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
