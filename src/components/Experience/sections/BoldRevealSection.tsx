"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { useArchClipPath } from "../ArchReveal";
import { CondensedHeadline } from "../CondensedHeadline";
import { ParallaxProduct, type ProductLane } from "../ParallaxProduct";

/**
 * Sits directly after the cinematic WebGL hero in the page flow.
 *
 * Two independent scroll phases drive it, which is why it tracks its own
 * scroll rather than reusing `<ArchReveal>` wholesale:
 *
 *  1. ARRIVAL (`start end` → `start start`): the section's top travels from
 *     the viewport's bottom to its top, and the circle curtain wipes the
 *     cream stage in over that. The sticky stage is still glued to the
 *     section's top throughout, so it's geometrically identical to the
 *     one-viewport-tall box `useArchClipPath` assumes.
 *  2. STAGE (`start start` → `end end`): the section is pinned and the
 *     remaining ~2 viewports of scroll are spent with the headline held dead
 *     still while the product cups rise through it — the reference's
 *     behaviour, where the type is the fixed frame and the products are what
 *     moves.
 *
 * The headline is a full-bleed poster, but a RAGGED one: the first two lines
 * run the width of the frame and the last trails off short, as in the
 * reference. That rules out fitting each line to the width individually —
 * `CondensedHeadline` measures one squeeze from the widest line and applies
 * it to all three, so the closing line stays short with the same letterforms.
 * The breaks are hardcoded so that raggedness is a decision rather than a
 * by-product of wrapping, which would re-break at every width.
 */
const LINES = ["Bite into bold.", "Derlings like never", "before."];

const FLAN = {
  src: "/Derlings_Strawberry_Flan_4x_Transparent.png",
  alt: "Derlings Strawberry Flan",
};
const PUDDING = {
  src: "/Derlings_Caramel_Pudding_4x_Transparent.png",
  alt: "Derlings Signature Caramel Pudding",
};

const SIZES = "(max-width: 768px) 40vw, 22vw";

/**
 * Lanes are split into the two that pass BEHIND the headline and the four
 * that pass in FRONT, because the crossing is the whole effect: a set of
 * products that all travel on one side of the type reads as a decorated
 * margin, not as depth.
 *
 * Every lane's travel span is a different length, so they separate as they
 * rise. They're deliberately unsynchronised at both ends too — nothing
 * enters or leaves the frame in formation.
 *
 * Only the two widest lanes survive below `md`: six cups crossing a
 * phone-width headline buries the type.
 */
const BEHIND: ProductLane[] = [
  {
    ...FLAN,
    id: "flan-left",
    className: "left-[-4%] w-[42%] md:left-[2%] md:w-[19%]",
    travel: [118, -128],
    rotate: [-20, -4],
    drift: [0, 3],
    sizes: SIZES,
  },
  {
    ...PUDDING,
    id: "pudding-mid-right",
    className: "right-[27%] hidden w-[12%] md:block",
    travel: [148, -164],
    rotate: [-4, -24],
    drift: [1.5, -1.5],
    sizes: SIZES,
  },
  {
    ...FLAN,
    id: "flan-center",
    className: "left-[45%] hidden w-[9%] md:block",
    travel: [232, -92],
    rotate: [-10, 8],
    sizes: SIZES,
  },
];

const IN_FRONT: ProductLane[] = [
  {
    ...PUDDING,
    id: "pudding-right",
    className: "right-[-6%] w-[46%] md:right-[3%] md:w-[22%]",
    travel: [162, -138],
    rotate: [14, -2],
    drift: [0, -3],
    sizes: SIZES,
  },
  {
    ...FLAN,
    id: "flan-mid-left",
    className: "left-[23%] hidden w-[11%] md:block",
    travel: [198, -106],
    rotate: [8, 28],
    drift: [-1, 2],
    sizes: SIZES,
  },
  {
    ...PUDDING,
    id: "pudding-near-right",
    className: "right-[13%] hidden w-[14%] md:block",
    travel: [182, -114],
    rotate: [20, 2],
    sizes: SIZES,
  },
];

export function BoldRevealSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionSafe();

  const { scrollYProgress: arrival } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  const { scrollYProgress: stage } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const clipPath = useArchClipPath(arrival);
  const contentOpacity = useTransform(arrival, [0.92, 1], [0, 1]);
  const contentY = useTransform(arrival, [0.92, 1], [24, 0]);

  // Lenis already smooths the wheel, but scroll progress still arrives as a
  // step per frame; a light spring on top is what turns the cups' travel from
  // "tracking the wheel" into a glide that keeps moving for a beat after the
  // scroll stops. Kept stiff enough (and with a tight restDelta) that it
  // never feels detached from the input.
  const smoothed = useSpring(stage, {
    stiffness: 90,
    damping: 26,
    mass: 0.35,
    restDelta: 0.0002,
  });
  const travel = reducedMotion ? stage : smoothed;

  return (
    // No background on this scroll-length wrapper: it is NOT clipped, so any
    // paint here would cover the hero for the section's whole 300vh and hide
    // the circle wipe completely. The cream belongs to the clipped stage
    // alone — that clip is the only thing that should be revealing it.
    <div id="bold" ref={sectionRef} className="relative z-10 h-[300vh]">
      <motion.div
        style={{ clipPath }}
        className="sticky top-0 flex h-screen items-center overflow-hidden bg-showcase-cream px-5 md:px-10"
      >
        {/* Three explicit stacking layers. The headline's own wrapper animates
            opacity, which makes it a stacking context of its own — so the
            cups can't be interleaved with it by z-index from the inside; they
            have to be siblings sitting either side of it. */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {BEHIND.map((lane) => (
            <ParallaxProduct key={lane.id} lane={lane} progress={travel} />
          ))}
        </div>

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative z-20 mx-auto w-full"
        >
          <CondensedHeadline lines={LINES} className="text-showcase-navy" />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-30">
          {IN_FRONT.map((lane) => (
            <ParallaxProduct key={lane.id} lane={lane} progress={travel} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
