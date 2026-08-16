import Image from "next/image";
import { Navbar } from "@/components/Premium/Navbar";
import { ProductGallery } from "@/components/Premium/ProductGallery";

export const metadata = {
  title: "Derlings — Products",
  description: "The Derlings signature range — scroll through the collection.",
};

export default function Flavors() {
  return (
    <>
      <Navbar />
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
          <h1 className="mt-8 max-w-2xl text-3xl font-semibold text-[#f3e6d3] md:text-5xl">
            Taste the Flavor
          </h1>
        </section>

        <ProductGallery />
      </main>
    </>
  );
}
