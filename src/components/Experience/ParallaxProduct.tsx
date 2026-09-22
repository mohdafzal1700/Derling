"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";

export interface ProductLane {
  /** Stable key — the same artwork is reused at several sizes, so `src` alone isn't unique. */
  id: string;
  src: string;
  alt: string;
  /**
   * Horizontal placement and size only (`left-…`/`right-…` + `w-…`, plus any
   * `hidden md:block`). Vertical position is owned entirely by the scroll
   * transform below, so lanes are anchored at `top-0` here and pushed down
   * past the fold by their own `travel` values.
   */
  className: string;
  /**
   * Where the lane's top edge sits, in vh, at stage progress 0 and 1. The
   * first number is >100 so the cup starts fully below the fold; the second
   * is negative enough to clear the top. Giving each lane a different span
   * is what makes them drift past each other instead of moving as one sheet
   * — that difference IS the parallax.
   */
  travel: [number, number];
  /** Flat in-plane tilt in degrees across the travel. No rotateX/Y: these are
   * flat product photos, and a 3D tilt reads as a skew rather than depth. */
  rotate: [number, number];
  /** Sideways drift in vw across the travel — a few degrees' worth of arc,
   * so the path reads as a curve rather than a rail. */
  drift?: [number, number];
  /** Rendered size hint for the srcset; these never exceed a third of the
   * viewport, so the 100vw default would pull down needlessly large files. */
  sizes: string;
}

/**
 * One product cup travelling up through the pinned stage as the page scrolls.
 *
 * The transform lives on the outer `motion.div` and nothing else animates:
 * Framer Motion composes the whole `transform` property on any element it
 * drives, so a static `rotate` written alongside an animated `y` on the same
 * element gets silently clobbered — hence rotation is a motion value here too
 * rather than a CSS string on a wrapper.
 */
export function ParallaxProduct({
  lane,
  progress,
}: {
  lane: ProductLane;
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [0, 1], [`${lane.travel[0]}vh`, `${lane.travel[1]}vh`]);
  const x = useTransform(
    progress,
    [0, 1],
    [`${lane.drift?.[0] ?? 0}vw`, `${lane.drift?.[1] ?? 0}vw`],
  );
  const rotate = useTransform(progress, [0, 1], lane.rotate);

  return (
    <motion.div
      className={`absolute top-0 ${lane.className}`}
      style={{
        x,
        y,
        rotate,
        filter: "drop-shadow(0 25px 30px rgba(30, 44, 76, 0.3))",
        // Promoted up front: a cup that only gets its own layer once it
        // starts moving produces a visible hitch on the first scroll tick.
        willChange: "transform",
      }}
    >
      <Image
        src={lane.src}
        alt={lane.alt}
        width={500}
        height={500}
        sizes={lane.sizes}
        className="h-auto w-full"
      />
    </motion.div>
  );
}
