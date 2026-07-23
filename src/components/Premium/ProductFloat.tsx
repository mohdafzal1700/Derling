"use client";

import { motion } from "framer-motion";

export interface ProductFloatProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical drift in px — keep tiny; this is a luxury float, not a bob. */
  amplitude?: number;
  /** Rotation in degrees. */
  rotate?: number;
  duration?: number;
  delay?: number;
  disabled?: boolean;
}

/**
 * The dessert cups themselves are baked into the hero photo, so their float
 * lives inside LiquidCanvas's mesh transform (a matching sine-driven
 * rotate/pan on the WebGL plane, see LiquidCanvas.tsx). This component gives
 * any DOM content that should feel physically attached to the product —
 * badges, price chips, CTA — the identical almost-imperceptible drift, so
 * nothing visually decouples from the plate as it floats.
 */
export function ProductFloat({
  children,
  className,
  amplitude = 4,
  rotate = 1.4,
  duration = 7,
  delay = 0,
  disabled = false,
}: ProductFloatProps) {
  return (
    <motion.div
      className={className}
      animate={
        disabled
          ? undefined
          : {
              y: [0, -amplitude, 0],
              rotate: [0, rotate, 0, -rotate * 0.7, 0],
            }
      }
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
