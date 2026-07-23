"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const LIGHT_SPRING = { stiffness: 45, damping: 16, mass: 0.9 };

/**
 * A soft studio-light glow that trails the cursor across the DOM layer,
 * stacked above the WebGL canvas (which already reacts to mouse position
 * for gloss) purely to reinforce the "cursor as light source" feel with a
 * cheap, GPU-composited radial gradient. Never sharp, never a flashlight —
 * large radius, low opacity, soft-light blend.
 */
export function MouseLight({ disabled = false }: { disabled?: boolean }) {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const springX = useSpring(x, LIGHT_SPRING);
  const springY = useSpring(y, LIGHT_SPRING);

  useEffect(() => {
    if (disabled) return;

    function onMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [disabled, x, y]);

  if (disabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: "soft-light" }}
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: 720,
          height: 720,
          background:
            "radial-gradient(circle, rgba(255,247,235,0.55) 0%, rgba(255,235,205,0.18) 45%, rgba(255,235,205,0) 72%)",
        }}
        className="absolute rounded-full"
      />
    </motion.div>
  );
}
