"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";

const foldGradient = (deg: string) =>
  `repeating-linear-gradient(${deg}, rgba(255,255,255,0.025) 0px, rgba(0,0,0,0.06) 8px, rgba(255,255,255,0.01) 16px, rgba(0,0,0,0.04) 24px, rgba(255,255,255,0.015) 32px, rgba(0,0,0,0.01) 40px)`;

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const STORAGE_KEY = "kemcon_intro_v1";

export function CurtainReveal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    } else {
      document.documentElement.removeAttribute("data-curtain");
    }
  }, []);

  // Fires synchronously before paint — removes CSS overlay the moment curtain is in the DOM
  useLayoutEffect(() => {
    if (visible) {
      document.documentElement.removeAttribute("data-curtain");
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex overflow-hidden">
      {/* Left panel */}
      <motion.div
        className="relative w-1/2 h-full"
        style={{
          backgroundColor: "#111318",
          backgroundImage: foldGradient("90deg"),
          boxShadow: "inset -24px 0 48px rgba(0,0,0,0.5)",
        }}
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: 0.65, delay: 0.35, ease: EASE }}
        onAnimationComplete={() => {
          localStorage.setItem(STORAGE_KEY, "1");
          setVisible(false);
        }}
      />

      {/* Right panel */}
      <motion.div
        className="relative w-1/2 h-full"
        style={{
          backgroundColor: "#111318",
          backgroundImage: foldGradient("270deg"),
          boxShadow: "inset 24px 0 48px rgba(0,0,0,0.5)",
        }}
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: 0.65, delay: 0.35, ease: EASE }}
      />

      {/* Logo — fades out just as panels begin to part */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none select-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.25 }}
      >
        <span
          className="text-5xl md:text-7xl font-bold tracking-[0.25em]"
          style={{ fontFamily: "var(--font-heading-en)" }}
        >
          <span style={{ color: "#EEEEF0" }}>KEM</span>
          <span style={{ color: "#D8D2C8" }}>CON</span>
        </span>
        <div className="h-px w-20" style={{ backgroundColor: "rgba(216,210,200,0.35)" }} />
        <span
          className="text-[10px] tracking-[0.5em] uppercase"
          style={{ color: "rgba(216,210,200,0.4)" }}
        >
          Premium Fabrics &amp; Furnishings
        </span>
      </motion.div>
    </div>
  );
}
