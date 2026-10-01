"use client";

import { motion } from "framer-motion";
import { fadeUpVariants } from "@/lib/animation";
import { BlurRevealHeading } from "./BlurRevealHeading";

const COMMITMENTS = [
  { number: "01", title: "No Preservatives", body: "Nothing added to stretch shelf life beyond what freshness allows." },
  { number: "02", title: "Small Batches", body: "Made in limited runs so quality never gets diluted for volume." },
  { number: "03", title: "90% Milk", body: "A cream-forward base — the reason it tastes like more than sugar." },
  { number: "04", title: "Refrigerated Fresh", body: "Kept cold from kitchen to counter, ready in five days or less." },
];

/** Value/commitment cards with a staggered fade-up reveal. */
export function CommitmentsGrid() {
  return (
    <section className="w-full bg-white px-6 py-24 md:px-16 lg:px-24">
      <BlurRevealHeading
        text="Our Commitments"
        className="font-display-showcase text-3xl leading-[0.95] text-[#0a1220] uppercase md:text-5xl"
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {COMMITMENTS.map((item, i) => (
          <motion.div
            key={item.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUpVariants}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
            className="group rounded-[1.5rem] border border-[#0a1220]/8 bg-[#f7e6d6] p-8 transition hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(10,18,32,0.25)]"
          >
            <span className="font-display-showcase text-sm text-[#c17a3d]" style={{ fontWeight: 800 }}>
              {item.number}
            </span>
            <p className="font-display-showcase mt-5 text-lg text-[#0a1220] uppercase" style={{ fontWeight: 800 }}>
              {item.title}
            </p>
            <p className="mt-2 text-sm text-[#0a1220]/60">{item.body}</p>
            <div className="mt-6 h-px w-8 bg-[#c17a3d] transition-all duration-300 group-hover:w-14" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
