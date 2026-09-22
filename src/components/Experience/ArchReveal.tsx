"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface ArchRevealProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * The circle-curtain clip, as a hook, so a caller that owns its own scroll
 * tracking (see BoldRevealSection, which needs a SECOND progress value for
 * the products travelling through the pinned stage) can drive the same
 * reveal without also inheriting this file's one-viewport-tall layout.
 *
 * The circle's center stays pinned to the CURRENT bottom of the viewport for
 * the entire scroll — not a fixed point on the clipped box's own edge — so
 * its radius grows straight up from the bottom of the screen: narrow near
 * its rising apex, widening toward the bottom of the frame, exactly the
 * "semicircle peeking up from the bottom" reference behaviour.
 *
 * `circle()`'s position is a fraction of the CLIPPED box's own height, not
 * the viewport's, so pinning the anchor to "current viewport bottom" takes a
 * bit of algebra: at progress 0, the box's top edge coincides with the
 * viewport's bottom (it's just arriving from below) — so "viewport bottom"
 * sits at the box's own local y=0%. At progress 1, the box has fully arrived
 * (its top is at the viewport's top) — so "viewport bottom" is now at local
 * y=100%. That identity — cy tracking scroll progress directly — only holds
 * because the clipped box is exactly one viewport tall, which is a
 * requirement on every caller of this hook.
 *
 * Any circle clipped by a hard box edge shows a FLAT segment wherever its
 * radius exceeds the distance from its center to that edge (`cy`) — the row
 * right at the edge is either fully inside or fully outside the circle at
 * every point across that flat width; there's no way for a plain `circle()`
 * to taper to a single point there once radius > cy. That's inherent to the
 * geometry, not a growth-curve bug.
 *
 * So the radius is kept EXACTLY equal to `cy` for almost the whole scroll —
 * the peak then just grazes the box's leading (top) edge as a single point, a
 * perfectly clean, flat-segment-free arc, at every moment. Only in the final
 * stretch does the radius exceed `cy`, ramping up to the exact amount needed
 * to also reach the box's top corners — which is unavoidable (a circle
 * tangent to the top edge alone doesn't necessarily reach the corners too),
 * but by then the section is nearly fully revealed anyway, so the brief flat
 * phase reads as "wrapping up" rather than a visible defect partway through.
 */
export function useArchClipPath(progress: MotionValue<number>) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return useTransform(progress, (v) => {
    const { width, height } = viewport;
    if (!width || !height) return "circle(0px at 50% 0%)";

    const halfWidth = width / 2;
    const cy = v * height;
    // The margin needed at v=1 so the radius reaches the box's top corners
    // exactly (guaranteeing full coverage) — computed from the actual
    // viewport size rather than a hardcoded constant.
    const finalMargin = Math.sqrt(halfWidth * halfWidth + height * height) - height;
    // Zero margin (radius === cy, a perfectly clean tangent point) for the
    // first 90% of the scroll; only in the last 10% does it ramp up to
    // finalMargin, closing the corner gaps right as the section finishes
    // revealing.
    const catchupStart = 0.9;
    const margin = v <= catchupStart ? 0 : (finalMargin * (v - catchupStart)) / (1 - catchupStart);
    const radius = cy + margin;

    return `circle(${radius}px at 50% ${v * 100}%)`;
  });
}

/**
 * A one-viewport-tall section that wipes itself in behind the circle curtain
 * above as it scrolls into place, fading its children in only once that
 * circle has essentially finished covering the screen.
 */
export function ArchReveal({ children, className, contentClassName }: ArchRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const clipPath = useArchClipPath(scrollYProgress);

  // Children stay invisible until the circle has essentially finished
  // covering the screen, then fade and settle in over the last stretch —
  // timed to the catch-up phase above (0.9 → 1) so they only appear once the
  // corners are actually closing in, not while there's still a visible gap.
  const contentOpacity = useTransform(scrollYProgress, [0.92, 1], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.92, 1], [24, 0]);

  return (
    <motion.div
      ref={ref}
      className={`relative flex h-screen items-center overflow-hidden ${className ?? ""}`}
      style={{ clipPath }}
    >
      <motion.div style={{ opacity: contentOpacity, y: contentY }} className={contentClassName}>
        {children}
      </motion.div>
    </motion.div>
  );
}
