"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { ParallaxLayer, ParallaxScene } from "@/components/Premium/ParallaxScene";
import { MouseLight } from "@/components/Premium/MouseLight";
import { CursorParticles } from "@/components/Premium/CursorParticles";
import { backgroundFadeVariants, heroContainerVariants } from "@/lib/animation";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { Loader } from "./Loader";
import { ExperienceNav } from "./ExperienceNav";
import { ExperienceHero } from "./ExperienceHero";

const HERO_IMAGE = "/Gemini_Generated_Image_qjosewqjosewqjos.png";

// WebGL only ever runs on the client, and skipping SSR for it avoids
// shipping/hydrating a throwaway server render of a <canvas>.
const LiquidCanvas = dynamic(
  () => import("@/components/Premium/LiquidCanvas").then((mod) => mod.LiquidCanvas),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-navy" /> },
);

/** navigator.hardwareConcurrency is undefined in some browsers/SSR; treat unknown as capable. */
function isLowEndDevice() {
  if (typeof navigator === "undefined") return false;
  return (navigator.hardwareConcurrency ?? 8) <= 4;
}

/**
 * Phase 1 of the cinematic /experience page: loader + hero only. Product
 * deep-dives, sub-brand sections, partner section and footer follow in
 * later phases — see the menu's anchors, which already point at where
 * they'll land.
 */
export function Experience() {
  const motionDisabled = useReducedMotionSafe();
  const [lowEnd] = useState(isLowEndDevice);
  const [tabHidden, setTabHidden] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const simPaused = motionDisabled || tabHidden || loading;

  return (
    <>
      {!motionDisabled && (
        <ReactLenis
          root
          options={{
            duration: 1.2,
            // Ease-out-expo — the standard Lenis recipe for the "buttery" glide
            // seen on Framer sites, noticeably smoother than a flat lerp factor.
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
          }}
        />
      )}
      {loading && <Loader onComplete={() => setLoading(false)} />}

      <motion.section
        initial="hidden"
        animate={loading ? "hidden" : "visible"}
        variants={heroContainerVariants}
        className="sticky top-0 z-0 h-[100svh] w-full overflow-hidden bg-navy"
      >
        <ExperienceNav />

        <ParallaxScene disabled={motionDisabled} className="absolute inset-0">
          <ParallaxLayer depthPx={2} className="absolute inset-0">
            <motion.div variants={backgroundFadeVariants} className="absolute inset-0">
              <LiquidCanvas imageSrc={HERO_IMAGE} paused={simPaused || lowEnd} />
            </motion.div>
          </ParallaxLayer>

          {!motionDisabled && <MouseLight />}
          {!motionDisabled && <CursorParticles disabled={lowEnd} />}
        </ParallaxScene>

        <ExperienceHero disabled={motionDisabled} />
      </motion.section>
    </>
  );
}
