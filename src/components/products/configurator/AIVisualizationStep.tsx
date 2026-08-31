"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Images, AlertCircle } from "lucide-react";
import { fabrics, fabricFamilies } from "@/data/fabrics";
import { colors, colorPromptPhrase } from "@/data/colors";
import { patterns } from "@/data/patterns";
import { frameMaterials, frameFinishes, fillingOptions } from "@/data/frames";
import type { CategoryType, ConfiguratorState } from "@/types/configurator";
import { InspirationGallery } from "@/components/shared/InspirationGallery";
import { track } from "@/lib/journey/track";

// Texture, weave, weight and drape only — never colour. Colour words here
// (the old "natural linen", "blackout") override the customer's swatch.
const FABRIC_VISUALS: Record<string, string> = {
  velvet: "a dense velvet pile with a soft directional sheen and heavy weight",
  linen: "an open linen weave with visible slub texture and a relaxed drape",
  silk: "a smooth silk face with fluid drape and a soft liquid sheen",
  cotton: "a crisp cotton weave with a matte face and clean structured folds",
  jacquard: "a jacquard weave with intricate raised motifs and dimensional relief",
  chenille: "a soft chenille pile with a velvety hand and a dense tactile surface",
  brocade: "a brocade weave with ornate raised motifs and fine metallic thread",
  sheer: "a fine semi-transparent voile weave that gently diffuses daylight",
  blackout: "a heavyweight densely woven face, completely opaque and light-blocking",
  wool: "a textured wool weave with a matte face and a heavy flowing drape",
  suede: "a suede-effect face with a soft brushed nap and a matte surface",
  synthetic: "a technical woven blend with a fine even texture and controlled drape",
};

// Positive phrasing only — the old "no pattern" is a negation, which diffusion
// models do not reliably honour.
const PATTERN_VISUALS: Record<string, string> = {
  Striped: "evenly spaced vertical stripes",
  Herringbone: "a classic herringbone twill",
  Checkered: "a regular checked motif",
  Geometric: "bold repeating geometric motifs",
  Damask: "an ornate damask medallion motif",
  Floral: "delicate floral motifs",
  Paisley: "intricate paisley motifs",
  Abstract: "an expressive abstract motif",
  Moroccan: "traditional Moroccan arabesque motifs",
};

// Only providers that accept one use this (DeepAI does, Pollinations ignores it).
const NEGATIVE_PROMPT = [
  "beige", "cream", "washed out", "desaturated", "colour cast", "wrong colour",
  "blurry", "soft focus", "low detail", "distorted", "people", "text", "watermark",
].join(", ");

// Set to a number to hold the seed steady while tuning prompts, so a change in
// the output is the prompt and not seed variance. null = random each run.
const DEBUG_SEED: number | null = null;

// Flip to false to silence the prompt debug output in the browser console.
const DEBUG_PROMPTS = process.env.NODE_ENV !== "production";

interface AIVisualizationStepProps {
  state: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  locale: string;
  category: CategoryType;
}

type TabGenState = "idle" | "loading" | "done" | "error";
type GenerationError = "rate-limited" | "daily-limit" | "unavailable" | "network";
type Tab = "room" | "detail";
type Mode = "ai" | "gallery";

export function AIVisualizationStep({
  state,
  onChange,
  locale,
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

  const frameMaterial = frameMaterials.find((m) => m.id === state.frameMaterialId);
  const frameFinish = frameFinishes.find((f) => f.id === state.frameFinishId);

  const fabricVisual =
    FABRIC_VISUALS[family?.id ?? ""] ?? "a finely woven upholstery-weight texture";
  const patternVisual = PATTERN_VISUALS[pattern?.name ?? ""] ?? "";
  const colorPhrase = colorPromptPhrase(color);

  // A solid needs no pattern clause at macro range — saying so only competes
  // with the weave detail. In the room shot a short cue still helps.
  const roomPattern = patternVisual ? `patterned with ${patternVisual}` : "in a single solid colour";
  const detailPattern = patternVisual ? `patterned with ${patternVisual}` : "";

  const frameVisual = [
    frameMaterial ? `a visible ${frameMaterial.name.toLowerCase()} frame and legs` : "",
    frameFinish ? `in a ${frameFinish.name.toLowerCase()} finish` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Shared tail. Neutral daylight rather than golden hour: this is a colour
  // preview, so an accurate swatch matters more than mood.
  const LIGHT = "even neutral daylight, true-to-life colour, no colour cast";
  const FINISH = "sharp focus throughout, realistic materials, no people";
  const ROOM = "calm uncluttered hotel interior behind it, pale neutral walls, muted furnishings";

  const buildRoomPrompt = () => {
    if (category === "chairs" || category === "sofas") {
      const piece = category === "chairs" ? "armchair" : "sofa";
      return [
        `interior photograph of a luxury hotel suite, a single ${piece} as the subject`,
        `the ${piece} is upholstered in ${colorPhrase} fabric`,
        `the upholstery has ${fabricVisual}`,
        roomPattern,
        frameVisual,
        `the ${colorPhrase} ${piece} is centred and fills most of the frame`,
        ROOM,
        LIGHT,
        FINISH,
      ]
        .filter(Boolean)
        .join(", ");
    }

    if (category === "bed-sheets") {
      return [
        "interior photograph of a luxury hotel bedroom, the dressed bed as the subject",
        `the bed is dressed in ${colorPhrase} bed linen`,
        `the fabric has ${fabricVisual}`,
        roomPattern,
        `the ${colorPhrase} bedding fills most of the frame, crisply made with soft natural creases`,
        ROOM,
        LIGHT,
        FINISH,
      ]
        .filter(Boolean)
        .join(", ");
    }

    return [
      "interior photograph of a luxury hotel suite, floor-to-ceiling curtains as the subject",
      `the curtains are made of ${colorPhrase} fabric`,
      `the fabric has ${fabricVisual}`,
      roomPattern,
      `the ${colorPhrase} curtains fill most of the frame, hanging in deep even vertical folds`,
      "a tall window behind them",
      ROOM,
      LIGHT,
      FINISH,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const buildDetailPrompt = () =>
    [
      `macro photograph of ${colorPhrase} fabric`,
      fabricVisual,
      detailPattern,
      "draped in soft folds, raking studio light revealing the weave texture",
      "mid-grey background, true-to-life colour, sharp focus",
    ]
      .filter(Boolean)
      .join(", ");

  const logSelections = (variant: Tab, prompt: string) => {
    if (!DEBUG_PROMPTS) return;

    const filling = fillingOptions.find((f) => f.id === state.fillingId);

    console.groupCollapsed(
      `%c[prompt] ${variant} — ${category}`,
      "color:#c9a227;font-weight:600"
    );

    console.table({
      category,
      fabricFamily: family ? `${family.name} (${family.id})` : "—",
      fabric: fabric ? `${fabric.name} (${fabric.id})` : "—",
      color: color ? `${color.name} ${color.hex}` : "—",
      pattern: pattern ? `${pattern.name} (${pattern.id})` : "—",
      frameMaterial: frameMaterial?.name ?? "—",
      frameFinish: frameFinish?.name ?? "—",
      filling: filling ? `${filling.name} / ${filling.firmness}` : "—",
      cushions: state.cushionAdd
        ? `${state.cushionQty ?? "?"}x ${state.cushionSameFabric ? "same fabric" : "contrast fabric"}`
        : "—",
      pillows: state.pillowAdd
        ? `${state.pillowSize ?? "?"} / ${state.pillowFill ?? "?"}`
        : "—",
      curtainControl: state.curtainControl ?? "—",
      curtainSize:
        state.curtainWidth || state.curtainHeight
          ? `${state.curtainWidth || "?"} x ${state.curtainHeight || "?"}`
          : "—",
      customDescription: state.customDescription || "—",
    });

    console.log("%cmapped phrases", "font-weight:600", {
      colorPhrase,
      fabricVisual,
      roomPattern,
      detailPattern,
      fabricVisualMatched: Boolean(FABRIC_VISUALS[family?.id ?? ""]),
      patternVisualMatched: Boolean(PATTERN_VISUALS[pattern?.name ?? ""]),
    });

    console.log("%cprompt sent to Pollinations", "font-weight:600");
    console.log(prompt);
    console.log("%cfull configurator state", "font-weight:600", state);
    console.groupEnd();
  };

  const fetchImage = async (prompt: string, seed: number, width: number, height: number) => {
    let response: Response;
    try {
      response = await fetch("/api/generate-curtain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, negativePrompt: NEGATIVE_PROMPT, seed, width, height }),
      });
    } catch {
      throw new Error("network");
    }
    if (response.status === 429) {
      const reason = await response
        .json()
        .then((body) => body?.reason)
        .catch(() => null);
      throw new Error(reason === "daily" ? "daily-limit" : "rate-limited");
    }
    if (!response.ok) throw new Error("unavailable");
    const pollinationsUrl = response.headers.get("X-Image-Url");
    if (DEBUG_PROMPTS) {
      console.log(
        `%cserved by model: ${response.headers.get("X-Model-Used")}`,
        "color:#c9a227;font-weight:600"
      );
    }
    const blob = await response.blob();
    return { blobUrl: URL.createObjectURL(blob), pollinationsUrl };
  };

  const generateRoom = async (isRegen = false) => {
    setRoomState("loading");
    setRoomError(null);
    setRoomUrl(null);
    if (isRegen) setRoomRegen((r) => r + 1);
    // Tracked on the room render only. The detail render is the same intent
    // seen from a second angle, and counting both would double every visitor
    // who used the feature once.
    track({ t: "ai_visualize", category });
    try {
      const prompt = buildRoomPrompt();
      logSelections("room", prompt);
      const { blobUrl, pollinationsUrl } = await fetchImage(prompt, DEBUG_SEED ?? Math.floor(Math.random() * 9999999), 1536, 1024);
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
      const prompt = buildDetailPrompt();
      logSelections("detail", prompt);
      const { blobUrl, pollinationsUrl } = await fetchImage(prompt, DEBUG_SEED ?? Math.floor(Math.random() * 9999999), 1024, 1280);
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


  const tabError = activeTab === "room" ? roomError : detailError;

  const errorMessage = (err: GenerationError | null) => {
    if (err === "daily-limit")
      return isAr
        ? "وصلت إلى الحد اليومي للتوليد. جرّب غدًا أو تصفّح معرض مشاريعنا."
        : "You've reached today's generation limit. Try again tomorrow or browse our portfolio.";
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

    </div>
  );
}
