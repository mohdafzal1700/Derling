import Image from "next/image";
import { Reveal } from "../Reveal";

const RESTAURANTS = [
  {
    name: "Cheenavala Restaurant",
    location: "Ground Floor Pushpamangalam, Edappally, Kochi",
    image: "/photo_1_2026-08-07_16-57-49.jpg",
  },
  {
    name: "Zaaha Kitchen",
    location: "Metro Pillar No 202, Muttom, Kalamassery, Kochi",
    image: "/photo_4_2026-08-07_16-57-49.jpg",
  },
];

export function RestaurantSection() {
  return (
    <section id="restaurants" className="relative z-10 bg-chocolate px-6 py-28 text-cream md:py-36">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal variant="label">
          <p className="mb-6 text-[12px] tracking-[0.35em] text-cream/40 uppercase">
            Available At
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl leading-[1.15] font-medium italic md:text-5xl">
            Already on the table.
          </h2>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 flex max-w-4xl flex-col gap-16 md:flex-row md:gap-10">
        {RESTAURANTS.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.1} className="flex-1">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px]">
              <Image
                src={r.image}
                alt={`Derlings at ${r.name}`}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 420px, 90vw"
              />
            </div>
            <p className="mt-5 text-[15px] text-cream/85">{r.name}</p>
            <p className="mt-1 text-[13px] text-cream/45">{r.location}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
