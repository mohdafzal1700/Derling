"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Placeholder milestones — swap the `year`/`title`/`body` copy for the
 * real founding date and history once it's confirmed. Each one is paired
 * with an image that the sticky column swaps to as that milestone becomes
 * active on scroll.
 */
const MILESTONES = [
  {
    year: "Year One",
    title: "Building the Foundation",
    body: "One small kitchen, one honest recipe — no shortcuts from day one. Every batch was tasted, adjusted, and tasted again until it felt right.",
    image: { src: "/about/women.jpeg", fit: "cover" as const },
  },
  {
    year: "Year Two",
    title: "First Outlet",
    body: "Derlings opened its doors to the public for the very first time — the same recipe, just no longer just for us.",
    image: { src: "/products/carmel.png", fit: "contain" as const },
  },
  {
    year: "Growing",
    title: "Expanding Beyond One Shelf",
    body: "Word spread, and so did the cups — outlet by outlet across the region, each one held to the exact same standard as the first.",
    image: { src: "/products/strawberry.png", fit: "contain" as const },
  },
  {
    year: "Today",
    title: "40+ Outlets",
    body: "Still made the same honest way, one small batch at a time — scale changed, the recipe never did.",
    image: { src: "/products/pista.png", fit: "contain" as const },
  },
];

/**
 * Placeholder founder — swap the name, role, and quote for the real
 * founder once confirmed. The backdrop photo is generic kitchen/lifestyle
 * imagery already used elsewhere on the site, not a portrait — no stock
 * photo of an unrelated real person is used to stand in for a founder who
 * doesn't yet have a photo on file.
 */
const FOUNDER = {
  initials: "FN",
  name: "Founder Name",
  role: "Founder, Derlings",
  quote:
    "We don’t chase shortcuts or cut corners for the sake of scale. Every cup still has to taste like it was made just for you.",
};

/** Three-column journey section — story, a sticky image that swaps per milestone, and a vertical timeline. */
export function PhilosophyReveal() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Continuous scroll progress across the whole timeline column — drives the
  // big circular scrubber that rides down the image's edge, rather than
  // snapping between the four milestone positions like the old small dot did.
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const markerTop = useTransform(timelineProgress, [0, 1], ["4%", "96%"]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = itemRefs.current.findIndex((el) => el === entry.target);
          if (index !== -1) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const el of itemRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-[#0a1220] px-6 py-32 md:px-10">
      <div className="mx-auto grid w-full max-w-[110rem] grid-cols-1 gap-16 lg:grid-cols-[1fr_0.9fr_1.1fr] lg:gap-12">
        {/* Left: intro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xs font-semibold tracking-[0.25em] text-white/40 uppercase">
            Derlings — Our Story
          </span>
          <h2 className="font-display-showcase mt-4 text-5xl leading-[0.95] font-extrabold text-white uppercase md:text-6xl">
            The
            <br />
            Journey
          </h2>
          <p className="mt-6 max-w-sm text-base text-white/60 md:text-lg">
            From one small kitchen to shelves across the region — still made the same honest way, one cup at a
            time. No investors rushing the recipe, no shortcuts to hit a number — just a slow, steady build, one
            outlet at a time.
          </p>

          <div className="mt-16 max-w-sm">
            <span aria-hidden className="font-display-showcase block text-4xl leading-none text-white/20">
              &ldquo;
            </span>
            <p className="font-display mt-3 text-lg leading-snug font-medium text-white/90 italic">
              {FOUNDER.quote}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                {FOUNDER.initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{FOUNDER.name}</p>
                <p className="text-xs text-white/50">{FOUNDER.role}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Middle: sticky image — stretches to the timeline's full height (grid's
            default row stretch) so the inner sticky box has room to pin while the
            timeline scrolls past; the visible frame swaps between milestone images. */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] w-full max-w-xs overflow-hidden bg-white/5"
              style={{ clipPath: "polygon(14% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 14%)" }}
            >
              {MILESTONES.map((milestone, i) => (
                <motion.div
                  key={milestone.image.src}
                  className="absolute inset-0"
                  animate={{ opacity: active === i ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Image
                    src={milestone.image.src}
                    alt=""
                    fill
                    className={milestone.image.fit === "cover" ? "object-cover" : "object-contain p-16"}
                    sizes="30vw"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Scrubber — a big circular marker riding down the image's right
                edge, tracking continuous scroll progress rather than snapping
                between the four milestone dots. */}
            <motion.div
              aria-hidden
              className="absolute top-0 right-0 z-20 flex h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-white/40 bg-[#0a1220]"
              style={{ top: markerTop }}
            >
              <span className="h-2 w-2 rounded-full bg-white" />
            </motion.div>
          </div>
        </div>

        {/* Right: vertical milestone timeline */}
        <div ref={timelineRef} className="relative flex flex-col gap-20 pl-8 lg:gap-[35vh]">
          {/* Grey track, always fully drawn. */}
          <span aria-hidden className="absolute top-1.5 bottom-1.5 left-[3px] w-px bg-white/15" />
          {/* Accent fill — grows continuously with scroll progress, so the
              line itself turns from grey to color as the journey advances,
              instead of just being drawn once on entrance. */}
          <motion.span
            aria-hidden
            style={{ scaleY: timelineProgress, transformOrigin: "top" }}
            className="absolute top-1.5 bottom-1.5 left-[3px] w-px bg-[#c17a3d]"
          />

          {MILESTONES.map((milestone, i) => (
            <motion.div
              key={milestone.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative transition-opacity duration-500"
              style={{ opacity: active === i ? 1 : 0.4 }}
            >
              <span
                aria-hidden
                className="absolute top-1.5 -left-8 h-2 w-2 rounded-full transition-colors duration-300"
                style={{ backgroundColor: active === i ? "#c17a3d" : "rgba(255,255,255,0.7)" }}
              />
              <p
                className="font-body-showcase text-xs font-semibold tracking-[0.25em] uppercase transition-colors duration-300"
                style={{ color: active === i ? "#c17a3d" : "rgba(255,255,255,0.4)" }}
              >
                {milestone.year}
              </p>
              <p className="font-display-showcase mt-2 text-xl font-bold text-white">{milestone.title}</p>
              <p className="mt-2 max-w-sm text-sm text-white/60">{milestone.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
