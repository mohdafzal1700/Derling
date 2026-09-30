"use client";

import { motion } from "framer-motion";
import { ProductFloat } from "@/components/Premium/ProductFloat";
import { editorialLabelVariants, editorialRevealVariants } from "@/lib/animation";
import { CondensedHeadline } from "./CondensedHeadline";
import { MagneticButton } from "./MagneticButton";

const HEADLINE_LINES = ["Crafted to become", "Your New Habit."];

export function ExperienceHero({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-end px-6 pb-24 text-center md:pb-28">
      {/* `w-full` down both wrappers: neither the outer flex column nor
          ProductFloat's plain div otherwise has a definite width (an
          `items-center` flex item shrink-wraps its own content instead of
          stretching), so the h1's `w-full` below has nothing real to resolve
          against and falls back to its own max-content size — capped by
          `max-w-[820px]`, so it overflows any viewport narrower than that.
          The old italic serif never got wide enough to expose this; the
          condensed Syne treatment does. */}
      <ProductFloat
        amplitude={3}
        rotate={0.8}
        duration={9}
        disabled={disabled}
        className="w-full"
      >
        <div className="flex w-full flex-col items-center">
          <motion.p
            variants={editorialLabelVariants}
            className="mb-7 text-[12px] tracking-[0.35em] text-white/40 uppercase md:text-[13px]"
          >
            Premium Chilled Foods
          </motion.p>

          {/* Framer Motion owns the whole `transform` property on any element
              it animates `y` on (see editorialRevealVariants), which would
              silently clobber the horizontal squeeze `CondensedHeadline`
              applies to fit Syne — much wider per em than the italic serif
              this replaced — into the same width the old headline held. So
              the reveal motion lives on the outer `motion.h1`, sized only by
              its `max-w`, and the measured condense lives inside it. */}
          <motion.h1
            variants={editorialRevealVariants}
            className="w-full max-w-[820px] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.45)]"
          >
            <CondensedHeadline
              lines={HEADLINE_LINES}
              align="center"
              uppercase={false}
              leadingClassName="leading-[1.05]"
              trackingClassName="tracking-normal"
            />
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
