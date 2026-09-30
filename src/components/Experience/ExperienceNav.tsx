"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Transition, type Variants } from "framer-motion";
import { useLenis } from "lenis/react";
import { navFadeVariants } from "@/lib/animation";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Flavors", href: "/flavors" },
  { label: "Collection", href: "/#collection" },
  { label: "About", href: "/about" },
  { label: "Where to Buy", href: "/#stockists" },
  { label: "Contact", href: "/contact" },
];
/** Full-width closing tile, like the reference's wide last row. */
const FEATURE_LINK = { label: "Partner With Us", href: "/#partner" };

const EMAIL = "derlingstoyou@gmail.com";
const PHONE = "+91 62381 27960";
const ADDRESS = "Ground Floor, Pushpamangalam, Service Rd, Edappally, Kochi";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/derlings_", icon: InstagramIcon },
  { label: "WhatsApp", href: "https://wa.me/916238127960", icon: WhatsAppIcon },
  { label: "Call", href: "tel:+916238127960", icon: PhoneIcon },
  { label: "Email", href: `mailto:${EMAIL}`, icon: MailIcon },
];

const BAR_HEIGHT = 56;
const EASE = [0.16, 1, 0.3, 1] as const;
const MORPH: Transition = { duration: 0.65, ease: EASE };

const tileVariants: Variants = {
  closed: { opacity: 0, y: 14, transition: { duration: 0.2, ease: EASE } },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay: 0.12 + i * 0.04 },
  }),
};

function subscribeResize(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}
const getViewportWidth = () => window.innerWidth;
const getServerViewportWidth = () => 1280;
const subscribeNothing = () => () => {};

/**
 * Floating compact bar that morphs — width, then height — into a grid menu
 * panel. It's one container throughout, not a bar plus a separate modal, so
 * the eye follows a single object open and closed. Portalled to <body> so
 * it and its blur overlay sit above every section's stacking context.
 */
export function ExperienceNav() {
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const vw = useSyncExternalStore(subscribeResize, getViewportWidth, getServerViewportWidth);
  const reduced = useReducedMotionSafe();
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Lock scroll (Lenis and native) while open; Escape closes.
  useEffect(() => {
    if (!open) return;
    const button = buttonRef.current;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prevOverflow;
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      button?.focus({ preventScroll: true });
    };
  }, [open, lenis]);

  if (!mounted) return null;

  const gutter = vw < 640 ? 24 : 48;
  const closedWidth = Math.min(560, vw - gutter);
  const openWidth = Math.min(680, vw - gutter);
  const morph = reduced ? { duration: 0 } : MORPH;
  const isActive = (href: string) => !href.includes("#") && href === pathname;

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            aria-hidden
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
            className="fixed inset-0 z-[90] bg-black/25 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={navFadeVariants}
        className="fixed inset-x-0 top-3 z-[100] flex justify-center md:top-4"
      >
        <motion.nav
          aria-label="Main"
          initial={false}
          animate={{
            width: open ? openWidth : closedWidth,
            height: open ? "auto" : BAR_HEIGHT,
          }}
          transition={{
            width: morph,
            // Height trails width a beat on open, leads it on close, so it
            // reads as the bar widening and then unfolding downward.
            height: reduced ? { duration: 0 } : { ...MORPH, delay: open ? 0.08 : 0 },
          }}
          // Frosted glass rather than a solid fill, so each page's own colour
          // bleeds through blurred. Radius of half the bar height makes the
          // closed bar a pill; the open panel keeps the same arched corners.
          style={{ borderRadius: BAR_HEIGHT / 2 }}
          className="font-body-showcase overflow-hidden border border-showcase-cream/15 bg-[#0a1220]/35 text-showcase-cream shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl backdrop-saturate-150"
        >
          <div className="flex items-center justify-between px-6" style={{ height: BAR_HEIGHT }}>
            <Link href="/" aria-label="Derlings home" onClick={close}>
              {/* Navy-only logo file: brightness(0) flattens it to black, invert flips to white. */}
              <Image
                src="/derlings-logo.svg"
                alt="Derlings"
                width={160}
                height={90}
                priority
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>

            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="group font-display-showcase flex items-center gap-4 py-2 text-[13px] font-bold tracking-[0.14em] uppercase"
            >
              <span className="relative block h-4 overflow-hidden leading-4">
                <motion.span
                  className="block"
                  animate={{ y: open ? "-100%" : "0%" }}
                  transition={morph}
                >
                  <span className="block">Menu</span>
                  <span className="block">Close</span>
                </motion.span>
              </span>
              <MenuIcon open={open} reduced={reduced} />
            </button>
          </div>

          <div
            id="site-menu"
            inert={!open}
            aria-hidden={!open}
            className="border-t border-showcase-cream/10"
          >
            {/* Hairlines are each tile's own right/bottom border rather than grid
                gaps, so a filled tile covers its cell exactly. The extra 1px of
                width pushes the last column's border under the panel's clip. */}
            <ul className="-mr-px grid grid-cols-2 sm:grid-cols-3">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  custom={i}
                  variants={tileVariants}
                  initial={false}
                  animate={open ? "open" : "closed"}
                  className="border-r border-b border-showcase-cream/10"
                >
                  <NavTile
                    index={i + 1}
                    label={link.label}
                    href={link.href}
                    active={isActive(link.href)}
                    onNavigate={close}
                    className="h-24 sm:h-28"
                  />
                </motion.li>
              ))}
              <motion.li
                custom={NAV_LINKS.length}
                variants={tileVariants}
                initial={false}
                animate={open ? "open" : "closed"}
                className="col-span-2 border-r border-showcase-cream/10 sm:col-span-3"
              >
                <NavTile
                  index={NAV_LINKS.length + 1}
                  label={FEATURE_LINK.label}
                  href={FEATURE_LINK.href}
                  active={false}
                  onNavigate={close}
                  className="h-16"
                />
              </motion.li>
            </ul>

            <motion.div
              custom={NAV_LINKS.length + 1}
              variants={tileVariants}
              initial={false}
              animate={open ? "open" : "closed"}
              className="border-t border-showcase-cream/10 px-6 py-7"
            >
              <a
                href={`mailto:${EMAIL}`}
                style={{ fontWeight: 800 }}
                className="type-condensed font-display-showcase block text-[6.2vw] leading-none uppercase transition-colors hover:text-caramel sm:text-[1.9rem]"
              >
                {EMAIL}
              </a>
              <p className="mt-4 text-[13px] leading-[1.7] tracking-[0.04em] text-showcase-cream/60 uppercase">
                {PHONE}
                <br />
                {ADDRESS}
              </p>
            </motion.div>

            <motion.ul
              custom={NAV_LINKS.length + 2}
              variants={tileVariants}
              initial={false}
              animate={open ? "open" : "closed"}
              className="-mr-px grid grid-cols-4 border-t border-showcase-cream/10"
            >
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <li key={label} className="border-r border-showcase-cream/10">
                  <a
                    href={href}
                    aria-label={label}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex h-14 items-center justify-center bg-showcase-cream/[0.04] text-showcase-cream transition-colors duration-300 hover:bg-showcase-cream hover:text-[#0a1220]"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>
        </motion.nav>
      </motion.div>
    </>,
    document.body,
  );
}

function NavTile({
  index,
  label,
  href,
  active,
  onNavigate,
  className = "",
}: {
  index: number;
  label: string;
  href: string;
  active: boolean;
  onNavigate: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group relative flex flex-col justify-between p-4 transition-colors duration-300 ease-out sm:p-5 ${
        active
          ? "bg-showcase-cream text-[#0a1220]"
          : "bg-showcase-cream/[0.04] text-showcase-cream hover:bg-showcase-cream hover:text-[#0a1220]"
      } ${className}`}
    >
      {/* Small square that drops in on hover / sits there when active. */}
      <span
        aria-hidden
        className={`absolute top-4 right-4 h-1.5 w-1.5 bg-current transition-all duration-300 sm:top-5 sm:right-5 ${
          active ? "opacity-100" : "-translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        }`}
      />
      <span
        className={`text-[11px] font-medium tracking-[0.1em] transition-all duration-300 ${
          active ? "opacity-70" : "opacity-45 group-hover:opacity-80"
        }`}
      >
        [{String(index).padStart(2, "0")}]
      </span>
      {/* Index sits top-left so the label gets the tile's full width. */}
      <span
        style={{ fontWeight: 800 }}
        className="font-display-showcase self-end text-right text-[13px] leading-none tracking-[0.04em] whitespace-nowrap uppercase transition-transform duration-300 group-hover:-translate-x-0.5 sm:text-[15px]"
      >
        {label}
      </span>
    </Link>
  );
}

/** 2×2 dots that fold into an X: the four squares slide in and fade while two bars rotate up. */
function MenuIcon({ open, reduced }: { open: boolean; reduced: boolean }) {
  const t = reduced ? { duration: 0 } : { duration: 0.45, ease: EASE };
  const dots = [
    [-4, -4],
    [4, -4],
    [-4, 4],
    [4, 4],
  ];
  return (
    <span aria-hidden className="relative block h-5 w-5">
      {dots.map(([x, y], i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 left-1/2 -mt-[2px] -ml-[2px] h-1 w-1 bg-current"
          animate={open ? { x: 0, y: 0, scale: 0, opacity: 0 } : { x, y, scale: 1, opacity: 1 }}
          transition={t}
        />
      ))}
      {[45, -45].map((r) => (
        <motion.span
          key={r}
          className="absolute top-1/2 left-1/2 -mt-px -ml-[9px] h-[2px] w-[18px] bg-current"
          animate={open ? { rotate: r, scaleX: 1, opacity: 1 } : { rotate: 0, scaleX: 0, opacity: 0 }}
          transition={t}
        />
      ))}
    </span>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M3.5 20.5 5 16.3A8.5 8.5 0 1 1 8 19.2Z" />
      <path d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5l.9-1.6-2-1-1 .9a4.6 4.6 0 0 1-2.2-2.2l.9-1-1-2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M5 3.5h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.6 6.6l1.4-2.3 4.5 1.8V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5.5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}
