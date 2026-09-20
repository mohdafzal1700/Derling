"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PREMIUM_EASE } from "@/lib/animation";

const STEPS = [
  {
    number: "01",
    title: "Real Ingredients",
    body: "Fresh cream, real fruit, real vanilla bean — nothing that needs explaining on the label.",
    image: "/products/carmel.png",
    accent: "#c17a3d",
  },
  {
    number: "02",
    title: "Slow-Poured",
    body: "Every batch is poured slow and set gently, the way a founding recipe deserves to be treated.",
    image: "/products/pista.png",
    accent: "#7e9a5b",
  },
  {
    number: "03",
    title: "Hand-Torched",
    body: "Finished by hand, one cup at a time — the small detail that separates a habit from a shortcut.",
    image: "/products/strawberry.png",
    accent: "#c94f63",
  },
  {
    number: "04",
    title: "Made Fresh Daily",
    body: "No long shelf life to hide behind. Small batches, made fresh, meant to be eaten soon.",
    image: "/products/Vanila.png",
    accent: "#d8c19a",
  },
];

/** Full-bleed alternating color panels, each fading/sliding in as it scrolls into view. */
export function ProcessSteps() {
  return (
    <section className="w-full">
      {STEPS.map((step, i) => {
        const light = step.accent === "#d8c19a";
        const reversed = i % 2 === 1;
        return (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.9, ease: PREMIUM_EASE }}
            className={`grid w-full md:h-[70vh] ${step.image ? "md:grid-cols-2" : ""} ${reversed ? "md:[&>*:first-child]:order-2" : ""}`}
            style={{ backgroundColor: step.accent }}
          >
            <div
              className={`flex flex-col justify-center gap-4 px-6 py-16 md:px-16 lg:px-24 ${step.image ? "" : "items-center text-center"}`}
            >
              <p
                className={`font-display-showcase text-5xl md:text-7xl ${light ? "text-black/80" : "text-white/80"}`}
                style={{ fontWeight: 900 }}
              >
                {step.number}
              </p>
              <p
                className={`font-display-showcase text-3xl uppercase md:text-5xl ${light ? "text-black" : "text-white"}`}
                style={{ fontWeight: 800 }}
              >
                {step.title}
              </p>
              <p className={`max-w-md text-base ${light ? "text-black/70" : "text-white/80"}`}>{step.body}</p>
            </div>

            {step.image ? (
              <div className="relative aspect-square w-full md:aspect-auto md:h-full">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-contain p-16"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            ) : null}
          </motion.div>
        );
      })}
    </section>
  );
}
