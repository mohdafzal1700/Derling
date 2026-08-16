"use client";

import { motion } from "framer-motion";
import { editorialLabelVariants, editorialRevealVariants } from "@/lib/animation";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** "label" for small uppercase kickers (less travel/blur), "content" for everything else. */
  variant?: "label" | "content";
  /** Extra delay (seconds) before this element starts revealing once in view. */
  delay?: number;
}

/**
 * Scroll-triggered version of the hero's mount-triggered reveal: fades in
 * (+ small blur-to-sharp, + small vertical settle) once scrolled into view,
 * once only. Used for every below-the-fold section so titles/copy arrive
 * the same unhurried way the hero's did, instead of just being present.
 */
export function Reveal({ children, className, variant = "content", delay = 0 }: RevealProps) {
  const base = variant === "label" ? editorialLabelVariants : editorialRevealVariants;
  const variants =
    delay > 0
      ? {
          hidden: base.hidden,
          visible: {
            ...(base.visible as Record<string, unknown>),
            transition: {
              ...(base.visible as { transition?: object }).transition,
              delay,
            },
          },
        }
      : base;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
