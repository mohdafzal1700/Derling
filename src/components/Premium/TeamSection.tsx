"use client";

import { motion } from "framer-motion";
import { fadeUpVariants } from "@/lib/animation";

/**
 * Placeholder team — swap the name/role/quote copy for the real team once
 * confirmed. Avatars are initials on a color field rather than photos: a
 * stock photo of an unrelated real person shouldn't stand in for someone
 * who doesn't yet have a photo on file.
 */
const TEAM = [
  {
    initials: "KL",
    name: "Kitchen Lead",
    role: "Recipe & Production",
    accent: "#c94f63",
    quote: "Every batch gets tasted before it ever leaves the kitchen — no exceptions.",
  },
  {
    initials: "QS",
    name: "Quality & Sourcing",
    role: "Ingredients",
    accent: "#7e9a5b",
    quote: "If it needs an asterisk on the label, it doesn't go in the cup.",
  },
  {
    initials: "OP",
    name: "Operations",
    role: "Outlets & Logistics",
    accent: "#c17a3d",
    quote: "Cold from the kitchen to the counter — that chain never breaks.",
  },
  {
    initials: "CC",
    name: "Customer Care",
    role: "Support",
    accent: "#8a6fae",
    quote: "Every message gets a real answer, from a real person.",
  },
];

/** "Behind Derlings" team grid on a navy field — a scrolling marquee headline, then teammates that reveal on hover. */
export function TeamSection() {
  return (
    <section className="w-full overflow-hidden bg-[#0a1220] py-24">
      <div className="px-6 md:px-16 lg:px-24">
        <span className="text-xs font-semibold tracking-[0.25em] text-white/40 uppercase">
          Derlings — The Team
        </span>
        <p className="mt-3 max-w-sm text-sm text-white/60 md:text-base">
          The people, in the kitchen and out of it, who make sure every cup still tastes like the first one.
        </p>
      </div>

      {/* Big scrolling marquee headline — the same infinite-ticker animation
          used elsewhere on the page, just set in the display type at a much
          larger size, cut off at both edges as it loops. */}
      <div className="mt-6 w-full overflow-hidden">
        <div
          className="ticker-track flex w-max items-center gap-[7.5rem] whitespace-nowrap"
          style={{ animationDuration: "30s" }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-[7.5rem]" aria-hidden={copy === 1}>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className="font-display-showcase text-6xl text-white/90 uppercase md:text-8xl"
                  style={{ fontWeight: 900 }}
                >
                  Behind Derlings
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-4 px-6 md:grid-cols-4 md:px-16 lg:px-24">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUpVariants}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10"
            style={{ backgroundColor: `${member.accent}1a` }}
          >
            {/* Backdrop grows from a soft tint to the full accent color on
                hover — the placeholder equivalent of a photo "sharpening
                into focus" the way the reference site's team cards do. */}
            <div
              className="absolute inset-0 scale-90 opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
              style={{ backgroundColor: member.accent }}
            />

            <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <span
                className="font-display-showcase flex h-14 w-14 items-center justify-center rounded-full text-lg text-white transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundColor: member.accent, fontWeight: 800 }}
              >
                {member.initials}
              </span>
              <div className="transition-opacity duration-300 group-hover:opacity-0">
                <p className="text-sm font-semibold text-white">{member.name}</p>
                <p className="text-xs text-white/50">{member.role}</p>
              </div>
            </div>

            {/* Hover reveal — name/role fade out, the quote slides up in their place. */}
            <div className="absolute inset-x-0 bottom-0 translate-y-4 p-5 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="text-sm font-semibold text-white">{member.name}</p>
              <p className="mt-2 text-sm font-medium text-white/80 italic">&ldquo;{member.quote}&rdquo;</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
