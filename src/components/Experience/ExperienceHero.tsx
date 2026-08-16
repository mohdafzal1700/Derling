"use client";

import { motion } from "framer-motion";
import { ProductFloat } from "@/components/Premium/ProductFloat";
import { editorialLabelVariants, editorialRevealVariants } from "@/lib/animation";
import { MagneticButton } from "./MagneticButton";

export function ExperienceHero({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-end px-6 pb-24 text-center md:pb-28">
      <ProductFloat amplitude={3} rotate={0.8} duration={9} disabled={disabled}>
        <div className="flex flex-col items-center">
          <motion.p
            variants={editorialLabelVariants}
            className="mb-7 text-[12px] tracking-[0.35em] text-white/40 uppercase md:text-[13px]"
          >
            Premium Chilled Foods
          </motion.p>

          <motion.h1
            variants={editorialRevealVariants}
            className="font-display max-w-[820px] text-5xl leading-[1.02] font-bold tracking-[0.01em] text-white italic [text-shadow:0_2px_28px_rgba(0,0,0,0.45)] md:text-7xl lg:text-[6.5rem]"
          >
            Crafted to become
            <br />
            Your New Habit.
          </motion.h1>

          <motion.p
            variants={editorialRevealVariants}
            className="mx-auto mt-7 max-w-[420px] text-[15px] leading-[1.7] font-normal text-white/55"
          >
            Premium chilled desserts, made for everyday indulgence — the right portion, the right
            price, ready whenever you are.
          </motion.p>

          <motion.div variants={editorialRevealVariants} className="mt-10">
            <MagneticButton
              href="#caramel-pudding"
              disabled={disabled}
              className="inline-block rounded-full border border-white/30 px-9 py-4 text-[13px] tracking-[0.15em] text-white uppercase shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-colors duration-500 hover:border-white/70 hover:bg-white/10"
            >
              Discover
            </MagneticButton>
          </motion.div>
        </div>
      </ProductFloat>
    </div>
  );
}
