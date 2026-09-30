"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PREMIUM_EASE } from "@/lib/animation";
import { WrittenWordmark } from "./WrittenWordmark";

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
    const t = setTimeout(() => setPhase("logo"), 150);
    return () => clearTimeout(t);
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
            {prefersReducedMotion ? (
              <Image
                src="/derlings-logo.svg"
                alt="Derlings"
                width={220}
                height={124}
                className="h-36 w-auto md:h-48"
                priority
              />
            ) : (
              <WrittenWordmark
                className="h-40 w-auto md:h-52"
                onDone={() => {
                  // Hold on the fully inked, solid-filled mark for a beat
                  // before the reveal starts — otherwise the fill finishes
                  // and the fade-out begins in the same instant, so the
                  // filled logo never actually gets seen.
                  setTimeout(() => {
                    setPhase((p) => (p === "logo" ? "reveal" : p));
                  }, 700);
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
