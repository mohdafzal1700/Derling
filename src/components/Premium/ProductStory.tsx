"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { PRODUCTS } from "@/data/products";
import { lerp } from "@/lib/animation";
import { TextUnfoldReveal } from "./TextUnfoldReveal";

const WORDS = ["Story", "Behind", "Flavor"];
/**
 * Scattered start offset for each word, in viewport units — collapses to
 * (0, 0) as the title converges. Each word keeps its natural horizontal
 * flex position (no sideways push, so nothing clips off-screen) and only
 * drops straight down, further for each later word.
 */
const SCATTER = [
  { x: 0, y: 0 },
  { x: 0, y: 12 },
  { x: 0, y: 26 },
];

/** Piecewise-linear interpolation across [progress, value] stops; clamps outside the given range. */
function keyframes(p: number, stops: Array<[number, number]>) {
  if (p <= stops[0][0]) return stops[0][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, v0] = stops[i];
    const [p1, v1] = stops[i + 1];
    if (p <= p1) return lerp(v0, v1, (p - p0) / (p1 - p0));
  }
  return stops[stops.length - 1][1];
}

type ProductStoryProps = {
  /** Image shown beside the headline in the second beat. */
  image?: string;
  /** Color the title beat sits on. */
  baseColor?: string;
  headline?: string;
  quote?: string;
};

/**
 * Brand story: one pinned viewport where scrolling drives the words
 * converging into a line AND the image + headline rising up from below at
 * the same time — not free page scroll, the motion is locked to scroll
 * input. The image's resting height is kept well clear of the heading's
 * footprint (heading bottom ~30vh, image top ~42vh) so the two can never
 * overlap at any point in the motion, and everything settles into one
 * complete, uncropped frame before the pin releases into normal scrolling
 * — closing on a centered quote. Placeholder copy/art, swap via props.
 */
export function ProductStory({
  image = PRODUCTS[0].image,
  baseColor = "#f7e6d6",
  headline = "Bringing slow-poured cream and honest flavor to every single cup.",
  quote = "Small batches, made fresh daily for every sweet craving — real cream, real fruit, softness inside.",
}: ProductStoryProps) {
  const prefersReducedMotion = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = pinRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      targetProgressRef.current = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    if (prefersReducedMotion) {
      setProgress(targetProgressRef.current);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    let raf = 0;
    const tick = () => {
      setProgress((prev) => {
        const diff = targetProgressRef.current - prev;
        return Math.abs(diff) < 0.0005 ? prev : prev + diff * 0.12;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  // Both start moving from the very first scroll input — the image rises in
  // tandem with the words converging, not after a static wait, so there's
  // never a long dead stretch where it just sits there half-cut. Words
  // settle a little earlier (by 0.5) while the image keeps rising the rest
  // of the way, finishing exactly when the pin releases (progress 1).
  const converge = keyframes(progress, [
    [0, 0],
    [0.5, 1],
  ]);
  const reveal = keyframes(progress, [
    [0, 0],
    [0.5, 1],
  ]);

  return (
    <>
      <section ref={pinRef} className="relative w-full" style={{ height: "220vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ backgroundColor: baseColor }}>
          <div className="absolute inset-x-0 top-0 px-[6vw] pt-[10vh] text-left">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:flex-nowrap md:justify-between">
              {WORDS.map((word, i) => (
                <span
                  key={word}
                  className="font-display-showcase whitespace-nowrap text-[#b6672f] uppercase"
                  style={{
                    fontSize: "clamp(1.6rem, 4.3vw, 4.75rem)",
                    lineHeight: 0.95,
                    fontWeight: 900,
                    transform: `translate(${lerp(SCATTER[i].x, 0, converge)}vw, ${lerp(SCATTER[i].y, 0, converge)}vh)`,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          <div
            className="absolute inset-x-0 bottom-0 grid gap-8 px-6 pb-[4vh] md:grid-cols-2 md:items-end md:gap-12 md:px-16 lg:px-24"
            style={{ transform: `translateY(${(1 - reveal) * 60}vh)` }}
          >
            <div className="relative aspect-4/5 w-full overflow-hidden bg-black/5 md:aspect-auto md:h-[70vh]">
              <Image src={image} alt="" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <div>
              <p className="font-display text-xl leading-[1.15] font-medium text-balance italic md:text-3xl">
                {headline}
              </p>
              <Image
                src="/derlings-logo.svg"
                alt="Derlings"
                width={140}
                height={79}
                className="mt-4 h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="flex min-h-[70vh] w-full items-center justify-center px-6 py-24 md:px-24"
        style={{ backgroundColor: baseColor }}
      >
        <TextUnfoldReveal
          text={quote}
          as="p"
          className="font-display-showcase max-w-3xl text-center text-3xl leading-[1.05] text-[#b6672f] uppercase md:text-5xl"
        />
      </section>
    </>
  );
}
