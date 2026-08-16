"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { Navbar } from "./Navbar";
import { ParallaxScene, ParallaxLayer } from "./ParallaxScene";
import { MouseLight } from "./MouseLight";
import { CursorParticles } from "./CursorParticles";
import { ProductFloat } from "./ProductFloat";
import {
  backgroundFadeVariants,
  fadeUpVariants,
  heroContainerVariants,
} from "@/lib/animation";

const HERO_IMAGE = "/Gemini_Generated_Image_qjosewqjosewqjos.png";

// WebGL only ever runs on the client, and skipping SSR for it avoids
// shipping/hydrating a throwaway server render of a <canvas>.
const LiquidCanvas = dynamic(
  () => import("./LiquidCanvas").then((mod) => mod.LiquidCanvas),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-[#171310]" /> },
);

/** navigator.hardwareConcurrency is undefined in some browsers/SSR; treat unknown as capable. */
function isLowEndDevice() {
  if (typeof navigator === "undefined") return false;
  return (navigator.hardwareConcurrency ?? 8) <= 4;
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  // Lazy initializer only ever runs on the client; it doesn't affect SSR
  // markup (only gates the ssr:false LiquidCanvas below), so there's no
  // hydration mismatch to guard against here.
  const [lowEnd] = useState(isLowEndDevice);
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const motionDisabled = Boolean(prefersReducedMotion);
  const simPaused = motionDisabled || tabHidden;

  return (
    <>
      {!motionDisabled && <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }} />}
      <Navbar />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroContainerVariants}
        className="relative h-[100svh] w-full overflow-hidden bg-[#171310]"
      >
        <ParallaxScene disabled={motionDisabled} className="absolute inset-0">
          <ParallaxLayer depthPx={2} className="absolute inset-0">
            <motion.div variants={backgroundFadeVariants} className="absolute inset-0">
              <LiquidCanvas imageSrc={HERO_IMAGE} paused={simPaused || lowEnd} />
            </motion.div>
          </ParallaxLayer>

          {!motionDisabled && <MouseLight />}
          {!motionDisabled && <CursorParticles disabled={lowEnd} />}
        </ParallaxScene>

        {/* Grounds the headline against a bright, busy photo without ever
            covering the product art itself — confined to the lower band the
            copy actually sits in, faded to nothing by mid-frame. */}
        <div className="absolute inset-x-0 bottom-0 z-[5] h-[55%] bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-end px-6 pb-20 text-center md:pb-28">
          <ProductFloat amplitude={3} rotate={0.8} duration={9} disabled={motionDisabled}>
            <motion.div variants={fadeUpVariants}>
              <p className="mb-4 text-xs tracking-[0.5em] text-white/60 uppercase">
                Derlings Signature Collection
              </p>
              <h1 className="max-w-3xl text-4xl leading-[1.05] font-semibold text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.35)] md:text-6xl">
                Cream, caramel, and strawberry —
                <br />
                poured with intent.
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-balance text-sm text-white/70 md:text-base">
                Move your cursor across the glaze. Every dessert is finished the way it looks right
                now — glossy, unhurried, alive.
              </p>
            </motion.div>
          </ProductFloat>
        </div>
      </motion.section>
    </>
  );
}
