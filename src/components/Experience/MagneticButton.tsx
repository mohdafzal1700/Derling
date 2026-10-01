"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

const MAGNETIC_RADIUS = 70;
const MAGNETIC_STRENGTH = 0.4;
const SPRING = { stiffness: 150, damping: 15, mass: 0.3 };

export interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Wraps a button/link so it gently pulls toward the cursor within a small
 * radius and eases back on leave — the "magnetic button" micro-interaction
 * luxury sites use instead of a hard hover state. Disabled (no listener,
 * static position) under prefers-reduced-motion.
 */
export function MagneticButton({ children, className, href, onClick, disabled = false }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  function handleMouseMove(e: React.MouseEvent) {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const distance = Math.hypot(dx, dy);
    if (distance < MAGNETIC_RADIUS + rect.width / 2) {
      x.set(dx * MAGNETIC_STRENGTH);
      y.set(dy * MAGNETIC_STRENGTH);
    } else {
      x.set(0);
      y.set(0);
    }
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <motion.div whileTap={disabled ? undefined : { scale: 0.94 }}>
        {href ? (
          // Internal routes go through <Link> so the transition is a client
          // navigation (and gets prefetched); mailto:/tel:/external stay
          // plain anchors.
          href.startsWith("/") ? (
            <Link href={href} onClick={onClick} className={className}>
              {children}
            </Link>
          ) : (
            <a href={href} onClick={onClick} className={className}>
              {children}
            </a>
          )
        ) : (
          <button type="button" onClick={onClick} className={className}>
            {children}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
