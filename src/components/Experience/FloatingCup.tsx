"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface FloatingCupProps {
  src: string;
  alt: string;
  className: string;
  /** Flat in-plane tilt, degrees — e.g. 12 or -8. No perspective/rotateX/Y: a
   * 3D-tilted cup reads as skewed, since it's a flat product photo rather
   * than a 3D render. The reference's donuts are just rotated flat images. */
  rotate: number;
  floatRange: [number, number, number];
  duration?: number;
  delay?: number;
  disabled?: boolean;
}

/**
 * One product cup, absolutely positioned by the caller so it can sit
 * directly over the headline text (see BoldRevealSection) rather than
 * boxed off to one side. The static rotation lives on this plain wrapper;
 * the nested `motion.div` owns only the float — Framer Motion composes and
 * overwrites the whole `transform` property on anything it animates `y`
 * on, so mixing a static rotate into that same element would get silently
 * clobbered the instant the float animation starts.
 */
export function FloatingCup({
  src,
  alt,
  className,
  rotate,
  floatRange,
  duration = 4,
  delay = 0,
  disabled = false,
}: FloatingCupProps) {
  return (
    <div
      className={className}
      style={{
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 25px 30px rgba(30, 44, 76, 0.3))",
      }}
    >
      <motion.div
        animate={disabled ? undefined : { y: floatRange }}
        transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={src} alt={alt} width={500} height={500} className="h-auto w-full" priority />
      </motion.div>
    </div>
  );
}
