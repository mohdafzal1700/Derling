"use client";

import { useEffect, useRef, useState } from "react";
import { dampFactor } from "@/lib/animation";

/**
 * Smoothly follows a changing numeric target via a single persistent rAF
 * loop (not restarted on every target change), using frame-rate independent
 * exponential damping. Use for DOM-driven values that don't warrant pulling
 * in a full framer-motion spring (e.g. a scroll-progress-derived opacity).
 */
export function useSmoothInterpolation(target: number, smoothing = 10) {
  const [value, setValue] = useState(target);
  const targetRef = useRef(target);
  const valueRef = useRef(target);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const factor = dampFactor(smoothing, dt);
      const next = valueRef.current + (targetRef.current - valueRef.current) * factor;
      valueRef.current = next;
      setValue(next);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [smoothing]);

  return value;
}
