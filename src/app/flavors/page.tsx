import Image from "next/image";
import { ExperienceNav } from "@/components/Experience/ExperienceNav";
import { Reveal } from "@/components/Experience/Reveal";
import { CategoryBrowser } from "@/components/Premium/CategoryBrowser";

export const metadata = {
  title: "Derlings — Products",
  description: "The Derlings signature range — scroll through the collection.",
};

export default function Flavors() {
  return (
    <>
      <ExperienceNav />
      <main className="min-h-screen bg-showcase-cream">
        <section className="relative flex h-[55vh] min-h-[460px] w-full items-center overflow-hidden px-6 shadow-[0_8px_24px_-8px_rgba(10,18,32,0.2)] md:px-16">
          <Image src="/flavors-hero.jpg" alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-showcase-cream/70 via-showcase-cream/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/15" />

          <div className="relative max-w-lg">
            <Reveal variant="label">
              <p className="font-body-showcase text-xs font-medium tracking-[0.4em] text-showcase-navy/50 uppercase">
                It&rsquo;s a new habit
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="font-display-showcase mt-4 text-4xl leading-[0.95] uppercase md:text-6xl" style={{ fontWeight: 900 }}>
                <span className="text-showcase-navy">Taste the</span>
                <br />
                <span className="text-[#c17a3d]">Flavor.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="font-body-showcase mt-5 max-w-sm text-sm text-showcase-navy/60 md:text-base">
                Small batches, real cream, no shortcuts — pick a category and find the one that&rsquo;s yours.
              </p>
            </Reveal>
          </div>
        </section>

        <CategoryBrowser />
      </main>
    </>
  );
}
