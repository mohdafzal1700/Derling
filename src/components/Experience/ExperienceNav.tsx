"use client";

import { motion } from "framer-motion";
import { navFadeVariants } from "@/lib/animation";

const NAV_LINKS = [
  { label: "ABOUT", href: "#partner" },
  { label: "CONTACT", href: "#contact" },
  { label: "SHOP", href: "#partner" },
];

/**
 * Fixed cream bar, navy text — deliberately the same regardless of what's
 * scrolled beneath it (the WebGL hero, a product section, the footer), so
 * it reads as a constant piece of chrome rather than something styled per
 * section like the rest of the page.
 */
export function ExperienceNav() {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navFadeVariants}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-showcase-cream px-6 py-5 text-showcase-navy md:px-12"
    >
      <a href="#" className="font-display-showcase text-xl font-extrabold uppercase tracking-tight">
        Derlings
      </a>

      <nav className="hidden items-center gap-10 font-body-showcase text-sm font-medium tracking-wider uppercase md:flex">
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href} className="transition-opacity hover:opacity-60">
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href="#cart"
        className="font-body-showcase text-sm font-medium tracking-wider uppercase transition-opacity hover:opacity-60"
      >
        CART (0)
      </a>
    </motion.header>
  );
}
