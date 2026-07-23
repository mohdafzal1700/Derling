"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { type MotionValue, motion, useMotionValue } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";

interface ParallaxContextValue {
  /** Raw pointer offset from viewport center, roughly -1..1, unsprung. */
  rawX: MotionValue<number>;
  rawY: MotionValue<number>;
}

const ParallaxContext = createContext<ParallaxContextValue | null>(null);

/**
 * Owns a single window pointermove listener and exposes the raw offset via
 * framer-motion MotionValues so every depth layer below can derive its own
 * spring-smoothed projection without each mounting a redundant listener.
 */
export function ParallaxScene({
  children,
  className,
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const value = useMemo(() => ({ rawX, rawY }), [rawX, rawY]);

  useEffect(() => {
    if (disabled) return;

    function onMove(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      rawX.set(nx);
      rawY.set(ny);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [disabled, rawX, rawY]);

  return (
    <ParallaxContext.Provider value={value}>
      <div className={className}>{children}</div>
    </ParallaxContext.Provider>
  );
}

function useParallaxContext() {
  const ctx = useContext(ParallaxContext);
  if (!ctx) throw new Error("ParallaxLayer must be used inside <ParallaxScene>");
  return ctx;
}

/**
 * Wraps a slice of the hero at a given "depth" — how many px it drifts at
 * full pointer excursion. Background ~2px, product art ~8px, foreground
 * droplets ~15px, per the brief.
 */
export function ParallaxLayer({
  depthPx,
  className,
  style,
  children,
}: {
  depthPx: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const { rawX, rawY } = useParallaxContext();
  const { x, y } = useParallax(rawX, rawY, depthPx);

  return (
    <motion.div style={{ ...style, x, y }} className={className}>
      {children}
    </motion.div>
  );
}
