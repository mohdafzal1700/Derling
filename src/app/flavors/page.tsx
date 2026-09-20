import Image from "next/image";
import { ExperienceNav } from "@/components/Experience/ExperienceNav";
import { ProductGallery } from "@/components/Premium/ProductGallery";
import { CategoryBrowser } from "@/components/Premium/CategoryBrowser";

export const metadata = {
  title: "Derlings — Products",
  description: "The Derlings signature range — scroll through the collection.",
};

export default function Flavors() {
  return (
    <>
      <ExperienceNav />
      <main className="min-h-screen bg-white">
        <section className="flex h-[50vh] min-h-[420px] w-full flex-col items-center justify-center bg-[#0a1220] px-6 text-center">
          <Image
            src="/derlings-logo.svg"
            alt="Derlings"
            width={220}
            height={124}
            className="h-14 w-auto brightness-0 invert md:h-16"
            priority
          />
          <p className="mt-5 text-xs tracking-[0.4em] text-white/50 uppercase">It&rsquo;s a new habit</p>
          <h1
            className="font-display-showcase mt-8 max-w-2xl text-3xl text-[#f3e6d3] uppercase md:text-5xl"
            style={{ fontWeight: 800 }}
          >
            Taste the Flavor
          </h1>
        </section>

        <CategoryBrowser />

        <ProductGallery />
      </main>
    </>
  );
}
