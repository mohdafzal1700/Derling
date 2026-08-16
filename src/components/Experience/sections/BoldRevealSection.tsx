"use client";

import { ArchReveal } from "../ArchReveal";
import { FloatingCup } from "../FloatingCup";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * Sits directly after the cinematic WebGL hero in the /experience page flow.
 * `ArchReveal` gives it the circle-reveal curtain wipe as it scrolls into
 * place, and only fades the headline/products in once that circle has
 * finished covering the screen.
 */
export function BoldRevealSection() {
  const disabled = useReducedMotionSafe();

  return (
    <ArchReveal
      className="z-10 bg-showcase-cream px-6 md:px-12"
      contentClassName="relative mx-auto h-[70vh] w-full max-w-6xl"
    >
      <h2
        style={{ fontWeight: 900 }}
        className="font-display-showcase relative z-10 text-5xl uppercase leading-[0.95] tracking-[-0.03em] text-showcase-navy sm:text-6xl md:text-7xl lg:text-8xl"
      >
        Bite into bold. Derlings like never before.
      </h2>

      <div className="pointer-events-none absolute inset-0 z-20">
        <FloatingCup
          src="/Derlings_Strawberry_Flan_4x_Transparent.png"
          alt="Derlings Strawberry Flan"
          className="absolute right-[24%] top-[10%] w-[34%] max-w-[280px] sm:top-[16%] md:right-[30%] md:top-[6%] md:w-[30%]"
          rotate={14}
          floatRange={[-15, 15, -15]}
          disabled={disabled}
        />

        <FloatingCup
          src="/Derlings_Caramel_Pudding_4x_Transparent.png"
          alt="Derlings Signature Caramel Pudding"
          className="absolute bottom-[10%] right-[8%] w-[38%] max-w-[320px] md:bottom-[12%] md:right-[14%] md:w-[34%]"
          rotate={-10}
          floatRange={[15, -15, 15]}
          delay={0.3}
          disabled={disabled}
        />
      </div>
    </ArchReveal>
  );
}
