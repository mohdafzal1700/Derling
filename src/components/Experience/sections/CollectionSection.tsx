"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { PRODUCTS, type Product } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { Reveal } from "../Reveal";

/**
 * Editorial product index on the home page, between the bold reveal and the
 * partner section. Modelled on the reference's stacked-collapse rhythm:
 *
 *  - Each row's image travels in from its own side (offset, a touch small,
 *    a degree or so off-true) and settles on a spring as the row rises.
 *  - Once the image's top reaches the PIN line it holds still there, and
 *    its bottom edge is clipped upward in lockstep with the row's bottom,
 *    so the next product visibly "pushes" it closed from below. Pin and clip
 *    read the RAW scroll progress (Lenis already smooths it) — sprung, the
 *    pinned frame would drift against the page and look unglued.
 *  - The copy drifts at its own rate against the image, and the number at
 *    yet another, which is where the sense of depth comes from.
 */

/** Viewport fraction from the top where images pin. */
const PIN_LINE = 0.14;

/** Shared with BoldRevealSection's cups so the whole page glides alike. */
const SCROLL_SPRING = { stiffness: 90, damping: 26, mass: 0.35, restDelta: 0.0002 };
const HOVER_SPRING = { stiffness: 140, damping: 22, mass: 0.6 };
/** Softer than HOVER_SPRING so the VIEW tag trails the cursor a beat. */
const LABEL_SPRING = { stiffness: 170, damping: 24, mass: 0.9 };

type Composition = {
  /** Which side the image sits on from `md` up. */
  side: "left" | "right";
  /** Width + nudge of the image column from `md` up. */
  imageClassName: string;
  /** Extra vertical placement of the copy, so the rows don't stack in formation. */
  textClassName: string;
  enter: { x: number; y: number; rotate: number };
  textDrift: number;
};

/**
 * Cycled over the products, so adding products to src/data/products.ts
 * extends the section without every row repeating the same move. The two
 * sides alternate, and the widths are kept modest so each product sits
 * inside the full-bleed gutter without dominating the screen.
 */
const COMPOSITIONS: Composition[] = [
  {
    side: "right",
    imageClassName: "md:w-[46%] lg:w-[40%]",
    textClassName: "md:pb-2",
    enter: { x: 110, y: 90, rotate: 1.6 },
    textDrift: 70,
  },
  {
    side: "left",
    imageClassName: "md:w-[44%] lg:ml-[4%] lg:w-[38%]",
    textClassName: "md:pb-[6%]",
    enter: { x: -120, y: 60, rotate: -1.4 },
    textDrift: 90,
  },
  {
    side: "right",
    imageClassName: "md:w-[42%] lg:mr-[6%] lg:w-[36%]",
    textClassName: "md:pb-[3%]",
    enter: { x: 70, y: 130, rotate: -1 },
    textDrift: 60,
  },
  {
    side: "left",
    imageClassName: "md:w-[46%] lg:w-[41%]",
    textClassName: "md:pb-0",
    enter: { x: -80, y: 110, rotate: 1.2 },
    textDrift: 100,
  },
];

type MotionMode = "static" | "mobile" | "tablet" | "desktop";

/** Movement scale per mode; tablet and mobile keep the idea, just quieter. */
const AMPLITUDE: Record<MotionMode, number> = { static: 0, mobile: 0.35, tablet: 0.6, desktop: 1 };

const MD = "(min-width: 768px)";
const LG = "(min-width: 1024px)";

function subscribeBreakpoints(onChange: () => void) {
  const queries = [window.matchMedia(MD), window.matchMedia(LG)];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

function getBreakpoint(): MotionMode {
  if (window.matchMedia(LG).matches) return "desktop";
  if (window.matchMedia(MD).matches) return "tablet";
  return "mobile";
}

function useMotionMode(): MotionMode {
  const reduced = useReducedMotionSafe();
  const breakpoint = useSyncExternalStore(subscribeBreakpoints, getBreakpoint, () => "desktop" as const);
  return reduced ? "static" : breakpoint;
}

const categoryName = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
const pad = (n: number) => String(n).padStart(2, "0");

export function CollectionSection() {
  const mode = useMotionMode();

  return (
    <section
      id="collection"
      className="relative z-10 overflow-x-clip bg-[#0a1220] px-5 py-28 text-showcase-cream md:px-10 md:py-40"
    >
      <div className="w-full">
        <header className="mb-20 flex flex-col gap-8 md:mb-[14vh] md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal variant="label">
              <p className="font-body-showcase mb-5 text-[12px] font-medium tracking-[0.35em] text-showcase-cream/40 uppercase">
                The Collection
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                style={{ fontWeight: 800 }}
                className="type-condensed font-display-showcase text-[13vw] leading-[0.9] uppercase md:text-[6.5rem]"
              >
                Signature
                <br />
                Range
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="md:max-w-[340px] md:pb-3">
            <p className="font-body-showcase text-[15px] leading-[1.7] text-showcase-cream/55">
              Made in small batches, set slow and kept cold. {pad(PRODUCTS.length)} recipes, each
              one refined until it earned its place.
            </p>
          </Reveal>
        </header>

        <ol>
          {PRODUCTS.map((product, i) => (
            // Keyed by mode so a breakpoint / reduced-motion change remounts the
            // row with the right scroll wiring instead of branching hooks.
            <ProductRow
              key={`${product.slug}-${mode}`}
              product={product}
              index={i}
              total={PRODUCTS.length}
              composition={COMPOSITIONS[i % COMPOSITIONS.length]}
              mode={mode}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProductRow({
  product,
  index,
  total,
  composition,
  mode,
}: {
  product: Product;
  index: number;
  total: number;
  composition: Composition;
  mode: MotionMode;
}) {
  const rowRef = useRef<HTMLLIElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const amp = AMPLITUDE[mode];
  // Pinning a frame on a phone just eats the screen — single column scrolls plainly.
  const pins = mode === "desktop" || mode === "tablet";
  const { enter } = composition;

  const { scrollYProgress: arrival } = useScroll({
    target: rowRef,
    offset: ["start end", "start 0.3"],
  });
  const { scrollYProgress: passage } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });
  // Measured on the untransformed wrapper, so the pin's own translate never
  // feeds back into its progress.
  const { scrollYProgress: pinRaw } = useScroll({
    target: imageRef,
    offset: [`start ${PIN_LINE}`, `end ${PIN_LINE}`],
  });

  const settle = useSpring(arrival, SCROLL_SPRING);
  const drift = useSpring(passage, SCROLL_SPRING);

  const imageX = useTransform(settle, [0, 1], [enter.x * amp, 0]);
  const imageY = useTransform(settle, [0, 1], [enter.y * amp, 0]);
  const imageRotate = useTransform(settle, [0, 1], [enter.rotate * Math.min(amp * 1.5, 1), 0]);
  const imageScale = useTransform(settle, [0, 1], [1 - 0.04 * Math.min(amp * 1.5, 1), 1]);
  const imageOpacity = useTransform(settle, [0, 0.45], [amp > 0 ? 0.35 : 1, 1]);

  const pin = useTransform(pinRaw, (p) => (pins ? p : 0));
  const pinY = useTransform(pin, (p) => `${p * 100}%`);
  const clipBottom = useTransform(pin, (p) => p * 100);
  const clipPath = useMotionTemplate`inset(0% 0% ${clipBottom}% 0%)`;
  const dim = useTransform(pin, [0, 1], [0, 0.55]);

  const textY = useTransform(drift, [0, 1], [composition.textDrift * amp, -composition.textDrift * amp]);
  const numberY = useTransform(
    drift,
    [0, 1],
    [composition.textDrift * 1.6 * amp, -composition.textDrift * 1.6 * amp],
  );
  const rule = useTransform(settle, [0.2, 1], [amp > 0 ? 0 : 1, 1]);

  const href = `/premium/${product.slug}`;
  const imageRight = composition.side === "right";

  return (
    <li
      ref={rowRef}
      className={`relative mt-24 flex flex-col gap-8 first:mt-0 md:mt-[12vh] md:items-end md:justify-between md:gap-12 ${
        imageRight ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <div ref={imageRef} className={`w-full ${composition.imageClassName}`}>
        <motion.div
          style={{ x: imageX, y: imageY, rotate: imageRotate, scale: imageScale, opacity: imageOpacity }}
          className="will-change-transform"
        >
          <motion.div style={{ y: pinY, clipPath }} className="relative">
            <HoverImage product={product} href={href} interactive={mode === "desktop" || mode === "tablet"} />
            <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-[#0a1220]" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{ y: textY }}
        className={`w-full md:w-[36%] ${composition.textClassName}`}
      >
        <motion.p
          style={{ y: numberY }}
          className="font-body-showcase mb-6 text-[13px] font-semibold tracking-[0.3em] text-caramel"
        >
          {pad(index + 1)} <span className="text-showcase-cream/25">/ {pad(total)}</span>
        </motion.p>

        <motion.div style={{ scaleX: rule }} className="h-px origin-left bg-caramel/70" />

        <h3
          style={{ fontWeight: 800 }}
          className="type-condensed font-display-showcase mt-7 text-[2.25rem] leading-[0.95] uppercase md:text-[2.6rem] lg:text-[3rem]"
        >
          {product.name}
        </h3>
        <p className="font-body-showcase mt-4 max-w-[380px] text-[15px] leading-[1.7] text-showcase-cream/60">
          {product.tagline}
        </p>

        <div className="mt-7 flex items-center justify-between gap-6">
          <span className="font-body-showcase text-[11px] font-medium tracking-[0.3em] text-showcase-cream/40 uppercase">
            {categoryName(product.category)}
          </span>
          <Link
            href={href}
            className="font-body-showcase group inline-flex items-center gap-3 text-[12px] font-semibold tracking-[0.2em] uppercase"
          >
            <span className="relative">
              View Product
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-showcase-cream transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
            </span>
            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </motion.div>
    </li>
  );
}

/**
 * The image drifts a few px against the cursor and swells slightly; a
 * "VIEW" tag stands in for the cursor and trails it on a softer spring.
 * Mouse only — touch gets a plain link.
 */
function HoverImage({ product, href, interactive }: { product: Product; href: string; interactive: boolean }) {
  const [hovered, setHovered] = useState(false);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);

  const driftX = useSpring(useTransform(nx, (v) => v * -16), HOVER_SPRING);
  const driftY = useSpring(useTransform(ny, (v) => v * -12), HOVER_SPRING);
  const labelX = useSpring(cx, LABEL_SPRING);
  const labelY = useSpring(cy, LABEL_SPRING);

  const track = (e: React.PointerEvent<HTMLAnchorElement>, jump = false) => {
    if (!interactive || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    nx.set(x / rect.width - 0.5);
    ny.set(y / rect.height - 0.5);
    cx.set(x);
    cy.set(y);
    // Start the tag where the cursor came in, not flying over from the corner.
    if (jump) {
      labelX.jump(x);
      labelY.jump(y);
    }
  };

  return (
    <Link
      href={href}
      aria-label={`View ${product.name}`}
      onPointerEnter={(e) => {
        if (!interactive || e.pointerType !== "mouse") return;
        track(e, true);
        setHovered(true);
      }}
      onPointerMove={(e) => track(e)}
      onPointerLeave={() => {
        setHovered(false);
        nx.set(0);
        ny.set(0);
      }}
      className={`relative block aspect-[3/2] overflow-hidden rounded-[2px] bg-showcase-cream ${
        interactive ? "[@media(pointer:fine)]:cursor-none" : ""
      }`}
    >
      <motion.div
        style={{ x: driftX, y: driftY }}
        animate={{ scale: hovered ? 1.05 : 1.02 }}
        transition={{ type: "spring", ...HOVER_SPRING }}
        className="absolute inset-[12%]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 40vw, (min-width: 768px) 46vw, 100vw"
        />
      </motion.div>

      {interactive && (
        <motion.span
          aria-hidden
          style={{ x: labelX, y: labelY }}
          className="pointer-events-none absolute top-0 left-0"
        >
          {/* Centering lives on its own element: motion owns the inner transform. */}
          <span className="block -translate-x-1/2 -translate-y-1/2">
            <motion.span
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
              transition={{ type: "spring", ...LABEL_SPRING }}
              className="font-body-showcase block border border-showcase-navy bg-showcase-navy px-3 py-1.5 text-[13px] font-semibold tracking-[0.12em] text-showcase-cream"
            >
              VIEW
            </motion.span>
          </span>
        </motion.span>
      )}
    </Link>
  );
}
