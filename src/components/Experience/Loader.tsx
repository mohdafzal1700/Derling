"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PREMIUM_EASE } from "@/lib/animation";

type Phase = "idle" | "logo" | "reveal" | "done";

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
      {/* The cream mass itself — a flat fill that simply fades out on reveal. */}
      <motion.div
        className="absolute inset-0 bg-showcase-cream"
        animate={{ opacity: phase === "reveal" ? 0 : 1 }}
        transition={{ duration: prefersReducedMotion ? 0.4 : 0.8, ease: PREMIUM_EASE }}
      />

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
                className="h-36 w-auto md:h-48"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
