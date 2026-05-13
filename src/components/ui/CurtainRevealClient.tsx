"use client";

import dynamic from "next/dynamic";

const CurtainReveal = dynamic(
  () => import("@/components/ui/CurtainReveal").then((m) => ({ default: m.CurtainReveal })),
  { ssr: false }
);

export function CurtainRevealClient() {
  return <CurtainReveal />;
}
