"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PREMIUM_EASE } from "@/lib/animation";

type Phase = "idle" | "logo" | "reveal" | "done";

/**
 * Liquid reveal: several full-viewport cream sheets, each clipped to a circle
 * centered at a different point that shrinks from fully-covering to zero on
 * its own delay. Framer Motion interpolates `clip-path: circle(...)` as a
 * plain string (same technique it uses for box-shadow), so this needs no
 * SVG filter — reliable across browsers. Because the circles are centered
 * differently and timed slightly apart, a given point on screen only clears
 * once *every* circle has shrunk past it, so the reveal edge is uneven and
 * retreating rather than one clean iris — closer to a liquid pulling back
 * than a wipe.
 */
const REVEAL_CIRCLES = [
  { cx: "50%", cy: "46%", delay: 0 },
  { cx: "28%", cy: "62%", delay: 0.1 },
  { cx: "70%", cy: "58%", delay: 0.06 },
  { cx: "45%", cy: "20%", delay: 0.16 },
];

export function Loader({ onComplete }: { onComplete: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const doneRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      const t = setTimeout(() => setPhase("reveal"), 250);
      return () => clearTimeout(t);
    }

    const timers = [
      setTimeout(() => setPhase("logo"), 150),
      setTimeout(() => setPhase("reveal"), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (phase !== "reveal" || doneRef.current) return;
    doneRef.current = true;
    const revealDuration = prefersReducedMotion ? 400 : 1100;
    const t = setTimeout(onComplete, revealDuration);
    return () => clearTimeout(t);
  }, [phase, onComplete, prefersReducedMotion]);

  const contentVisible = phase !== "idle" && phase !== "reveal" && phase !== "done";

  return (
    <div className="fixed inset-0 z-50" aria-hidden={phase === "reveal" || phase === "done"}>
      {/* The cream mass itself — either a flat fill (idle/content phases) or
          the shrinking clip-path circles (reveal), never both, so there's
          no seam between the two. */}
      {phase !== "reveal" ? (
        <div className="absolute inset-0 bg-showcase-cream" />
      ) : (
        REVEAL_CIRCLES.map((circle, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 bg-showcase-cream"
            initial={{ clipPath: `circle(150% at ${circle.cx} ${circle.cy})` }}
            animate={{ clipPath: `circle(0% at ${circle.cx} ${circle.cy})` }}
            transition={{
              duration: prefersReducedMotion ? 0.4 : 1.05,
              delay: prefersReducedMotion ? 0 : circle.delay,
              ease: PREMIUM_EASE,
            }}
          />
        ))
      )}

      <AnimatePresence>
        {contentVisible && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: PREMIUM_EASE }}
            >
              <Image
                src="/derlings-logo.svg"
                alt="Derlings"
                width={220}
                height={124}
                className="h-28 w-auto md:h-32"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
