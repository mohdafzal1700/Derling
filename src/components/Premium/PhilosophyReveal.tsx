"use client";

import { motion } from "framer-motion";
import { fadeUpVariants } from "@/lib/animation";
import { BlurRevealHeading } from "./BlurRevealHeading";

/** Text-only philosophy statement on a solid navy field, headline revealing word-by-word on scroll. */
export function PhilosophyReveal() {
  return (
    <section className="flex min-h-[70vh] w-full flex-col items-center justify-center bg-[#0a1220] px-6 py-24 text-center md:px-16">
      <BlurRevealHeading
        text="Our Philosophy"
        className="font-display-showcase justify-center text-3xl leading-[0.95] text-white uppercase md:text-6xl"
      />
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={fadeUpVariants}
        className="mt-6 max-w-md text-base text-white/70 md:text-lg"
      >
        Every cup should feel like it was made for one person, even when we make thousands. That&rsquo;s the only
        shortcut we refuse to take.
      </motion.p>
    </section>
  );
}
