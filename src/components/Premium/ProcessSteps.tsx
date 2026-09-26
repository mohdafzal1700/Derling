"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PREMIUM_EASE } from "@/lib/animation";

const STEPS = [
  {
    number: "01",
    title: "Hand-Torched",
    body: "Finished by hand, one cup at a time — the small detail that separates a habit from a shortcut.",
    image: "/products/strawberry.png",
    accent: "#c94f63",
    tilt: -6,
  },
  {
    number: "02",
    title: "Made Fresh Daily",
    body: "No long shelf life to hide behind. Small batches, made fresh, meant to be eaten soon.",
    image: "/products/Vanila.png",
    accent: "#c17a3d",
    tilt: 6,
  },
];

/**
 * Two "polaroid" cards connected by a single dotted line — each one settles
 * into place with a tilt-and-drop entrance instead of a plain fade, and the
 * line itself draws between them as they scroll into view.
 */
export function ProcessSteps() {
  return (
    <section className="w-full bg-showcase-cream px-6 py-28 md:px-16">
      <div className="relative mx-auto grid max-w-4xl grid-cols-1 gap-20 sm:grid-cols-2 sm:gap-12">
        {/* Connecting line — desktop only, threads the two cards together. */}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: PREMIUM_EASE, delay: 0.3 }}
          style={{ transformOrigin: "left" }}
          className="absolute top-[13.5rem] right-[12%] left-[12%] hidden h-px bg-showcase-navy/15 sm:block"
        />

        {STEPS.map((step, i) => (
          <div key={step.number} className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -30, rotate: step.tilt * 2.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: step.tilt }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              whileHover={{ rotate: 0, scale: 1.03 }}
              className="relative aspect-square w-full max-w-[15rem] overflow-hidden rounded-lg border border-showcase-navy/10 bg-white p-3 shadow-[0_20px_40px_-18px_rgba(30,44,76,0.3)]"
            >
              <div className="relative h-full w-full overflow-hidden rounded-sm bg-showcase-cream">
                <Image src={step.image} alt={step.title} fill className="object-contain p-6" sizes="240px" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: i * 0.15 + 0.3, ease: PREMIUM_EASE }}
              className="mt-8 flex flex-col items-center gap-2"
            >
              <span
                className="font-display-showcase text-3xl"
                style={{ fontWeight: 900, color: step.accent }}
              >
                {step.number}
              </span>
              <p className="font-display-showcase text-xl text-showcase-navy uppercase" style={{ fontWeight: 800 }}>
                {step.title}
              </p>
              <p className="max-w-[16rem] text-sm text-showcase-navy/60">{step.body}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
