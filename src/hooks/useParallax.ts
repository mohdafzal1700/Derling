"use client";

import { type MotionValue, useSpring, useTransform } from "framer-motion";
import { SPRING_VISCOUS } from "@/lib/animation";

/**
 * Projects a shared raw pointer-offset motion value (see ParallaxScene,
 * range roughly -1..1 from viewport center) into a depth-scaled, spring-
 * smoothed pixel offset. Depth mirrors real parallax: background layers
 * pass a small px value, foreground layers a large one.
 */
export function useParallax(rawX: MotionValue<number>, rawY: MotionValue<number>, depthPx: number) {
  const targetX = useTransform(rawX, (v) => v * depthPx);
  const targetY = useTransform(rawY, (v) => v * depthPx);
  const x = useSpring(targetX, SPRING_VISCOUS);
  const y = useSpring(targetY, SPRING_VISCOUS);
  return { x, y };
}
