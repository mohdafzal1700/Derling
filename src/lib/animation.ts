import type { Transition, Variants } from "framer-motion";

/** Shared premium easing curve — slow start, decisive settle, no bounce. */
export const PREMIUM_EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

export const SPRING_SOFT: Transition = { type: "spring", stiffness: 60, damping: 20, mass: 1 };
export const SPRING_SNAPPY: Transition = { type: "spring", stiffness: 220, damping: 26, mass: 0.6 };
/** Heavier, slower-settling spring for cream/liquid-adjacent motion (drop shadows, gloss). */
export const SPRING_VISCOUS: Transition = { type: "spring", stiffness: 40, damping: 14, mass: 1.4 };

export const heroContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: PREMIUM_EASE },
  },
};

export const logoEntranceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: PREMIUM_EASE },
  },
};

export const navFadeVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: PREMIUM_EASE, delay: 0.2 },
  },
};

export const backgroundFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/** Linear interpolation, clamped to [0, 1] progress. */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

/** Exponential smoothing factor for a per-frame follow (frame-rate independent). */
export function dampFactor(smoothing: number, dt: number) {
  return 1 - Math.exp(-smoothing * dt);
}
