"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { navFadeVariants, logoEntranceVariants } from "@/lib/animation";

const PREMIUM_EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

const LEFT_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/flavors" },
  { label: "About", href: "#about" },
];

const RIGHT_LINKS = [
  { label: "Our Story", href: "#story" },
  { label: "Contact", href: "#contact" },
];

/**
 * Sticky, glass navbar with the logo pinned dead-center regardless of how
 * unbalanced the left/right link groups are (3-column grid, not flex
 * space-between). Background/blur/border interpolate smoothly from fully
 * transparent to a glass panel as the page scrolls, driven by scroll
 * progress rather than a hard breakpoint so there's no visible snap.
 */
export function Navbar() {
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, [0, 160], [0, 1], { clamp: true });

  const background = useTransform(
    progress,
    [0, 1],
    ["rgba(18,14,12,0)", "rgba(18,14,12,0.55)"],
  );
  const blurPx = useTransform(progress, [0, 1], [0, 16]);
  const backdropFilter = useMotionTemplate`blur(${blurPx}px) saturate(160%)`;
  const borderOpacity = useTransform(progress, [0, 1], [0.06, 0.16]);
  const borderColor = useMotionTemplate`rgba(255,255,255,${borderOpacity})`;
  const shadowOpacity = useTransform(progress, [0, 1], [0, 0.25]);
  const boxShadow = useMotionTemplate`0 8px 32px rgba(0,0,0,${shadowOpacity})`;

  return (
    <motion.header
      variants={navFadeVariants}
      style={{ background, backdropFilter, WebkitBackdropFilter: backdropFilter, borderColor, boxShadow }}
      className="fixed inset-x-0 top-0 z-30 grid grid-cols-3 items-center border-b px-6 py-4 md:px-10"
    >
      <nav className="flex items-center gap-6 text-xs tracking-[0.15em] text-white/75 uppercase md:gap-8 md:text-sm">
        {LEFT_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="transition-colors duration-300 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <motion.div variants={logoEntranceVariants} className="flex justify-center">
        <Image
          src="/derlings-logo.svg"
          alt="Derlings"
          width={140}
          height={79}
          className="h-8 w-auto brightness-0 invert md:h-9"
          priority
        />
      </motion.div>

      <nav className="flex items-center justify-end gap-6 text-xs tracking-[0.15em] text-white/75 uppercase md:gap-8 md:text-sm">
        {RIGHT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="transition-colors duration-300 hover:text-white"
            style={{ transitionTimingFunction: PREMIUM_EASE_CSS }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </motion.header>
  );
}
