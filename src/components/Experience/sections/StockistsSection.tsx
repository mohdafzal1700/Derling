import Image from "next/image";
import { Reveal } from "../Reveal";

type Stockist = { name: string; logo: string };

/** Logos live in public/stockists (3:2, 1200px wide) — add a file and an entry here to extend the strip. */
const STOCKISTS: Stockist[] = [
  { name: "Al-Sheba", logo: "/stockists/al-sheba.png" },
  { name: "Peekay Hypermarket", logo: "/stockists/peekay-hypermarket.png" },
  { name: "Let's Eat Bakers", logo: "/stockists/lets-eat-bakers.png" },
  { name: "Green Leaf Online", logo: "/stockists/green-leaf.png" },
  { name: "Yaghma Kababs", logo: "/stockists/yaghma-kababs.png" },
  { name: "Thaal Kitchen", logo: "/stockists/thaal-kitchen.png" },
  { name: "Zaaha Kitchen", logo: "/stockists/zaaha-kitchen.png" },
  { name: "Halwani", logo: "/stockists/halwani.png" },
  { name: "Kira", logo: "/stockists/kira.png" },
];

/**
 * "Available at" strip between the collection and the FAQ: an endless row of
 * stockist logos. The list is rendered twice and the track slides by -50%
 * (the shared `ticker` keyframes), so the loop seam is invisible.
 */
export function StockistsSection() {
  return (
    <section
      id="stockists"
      className="relative z-10 overflow-hidden border-b border-showcase-navy/10 bg-showcase-cream py-24 text-showcase-navy md:py-32"
    >
      <header className="mb-14 flex flex-col gap-6 px-5 md:mb-16 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <Reveal variant="label">
            <p className="font-body-showcase mb-5 text-[12px] font-medium tracking-[0.35em] text-showcase-navy/40 uppercase">
              Available At
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              style={{ fontWeight: 800 }}
              className="type-condensed font-display-showcase text-[11vw] leading-[0.9] uppercase md:text-[5rem]"
            >
              Find us near you
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="md:max-w-[340px] md:pb-2">
          <p className="font-body-showcase text-[15px] leading-[1.7] text-showcase-navy/55">
            Chilled and ready at our partner stores, bakeries and kitchens across Kerala.
          </p>
        </Reveal>
      </header>

      <div className="group relative [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <ul className="ticker-track flex w-max items-center gap-5 [animation-duration:40s] group-hover:[animation-play-state:paused] motion-reduce:[animation:none] md:gap-8">
          {[...STOCKISTS, ...STOCKISTS].map((s, i) => (
            <li
              key={`${s.name}-${i}`}
              aria-hidden={i >= STOCKISTS.length}
              className="relative aspect-[3/2] h-28 shrink-0 overflow-hidden rounded-[18px] bg-white shadow-[0_20px_50px_rgba(30,44,76,0.14)] md:h-40"
            >
              <Image
                src={s.logo}
                alt={i >= STOCKISTS.length ? "" : s.name}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 360px, 250px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
