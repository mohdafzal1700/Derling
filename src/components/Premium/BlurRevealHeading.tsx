"use client";

import { motion } from "framer-motion";
import { editorialRevealVariants, wordStaggerContainerVariants } from "@/lib/animation";

/** Headline that reveals word-by-word (blur + rise) as it scrolls into view. */
export function BlurRevealHeading({
  text,
  as: Tag = "h2",
  className = "",
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={wordStaggerContainerVariants}
    >
      <Tag className={`flex flex-wrap ${className}`}>
        {words.map((word, i) => (
          <motion.span key={i} variants={editorialRevealVariants} className="mr-[0.28em] inline-block">
            {word}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
}
