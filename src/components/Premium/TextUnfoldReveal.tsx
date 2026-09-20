"use client";

import { motion } from "framer-motion";
import { PREMIUM_EASE } from "@/lib/animation";

/** Headline that unfolds from a tilted, scaled-down 3D twist into flat resting position on scroll. */
export function TextUnfoldReveal({
  text,
  className = "",
  align = "center",
  as = "h2",
}: {
  text: string;
  className?: string;
  align?: "center" | "start";
  as?: "h2" | "p";
}) {
  const MotionTag = motion[as];

  return (
    <div style={{ perspective: 1000 }} className={`flex ${align === "center" ? "justify-center" : "justify-start"}`}>
      <MotionTag
        initial={{ opacity: 0, scale: 0.5, rotate: -8, rotateX: 20, rotateY: 15 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0, rotateX: 0, rotateY: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, ease: PREMIUM_EASE }}
        className={className}
        style={{ fontWeight: 900 }}
      >
        {text}
      </MotionTag>
    </div>
  );
}
