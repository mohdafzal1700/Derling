"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, getOtherProducts } from "@/data/products";
import { isLightColor } from "@/lib/color";
import { SPRING_SOFT } from "@/lib/animation";

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Flips through PRODUCTS in place — no page navigation — with the incoming
 * image animating in from small to large. The URL is kept in sync via
 * history.replaceState (cosmetic only) so a direct link to /premium/[slug]
 * still lands on the right product without forcing a full route change
 * every time the user steps to the next/previous one.
 */
export function ProductDetail({ initialSlug }: { initialSlug: string }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(() => {
    const i = PRODUCTS.findIndex((p) => p.slug === initialSlug);
    return i === -1 ? 0 : i;
  });

  const active = PRODUCTS[activeIndex];
  const nextProduct = PRODUCTS[(activeIndex + 1) % PRODUCTS.length];
  const light = isLightColor(active.accent);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    window.history.replaceState(null, "", `/premium/${active.slug}`);
    setActiveImageIndex(0);
  }, [active.slug]);

  const goNext = () => setActiveIndex((i) => (i + 1) % PRODUCTS.length);
  const goTo = (slug: string) => setActiveIndex(PRODUCTS.findIndex((p) => p.slug === slug));

  return (
    <main className="min-h-screen bg-white pt-20 pb-20">
      <div className="grid min-h-[85vh] w-full md:grid-cols-2">
        <div
          className="flex flex-col justify-center gap-14 px-8 py-16 transition-colors duration-500 md:px-14 lg:px-20"
          style={{ backgroundColor: active.accent }}
        >
          <div>
            <span
              className={`font-display-showcase inline-block rounded-full px-4 py-1.5 text-xs tracking-widest uppercase ${light ? "bg-black/10 text-black/70" : "bg-white/90 text-black/70"}`}
              style={{ fontWeight: 700 }}
            >
              {active.badge}
            </span>

            <h1
              className={`font-display-showcase mt-6 text-5xl leading-[0.95] uppercase md:text-6xl lg:text-7xl ${light ? "text-black" : "text-white"}`}
              style={{ fontWeight: 900 }}
            >
              {active.name}
            </h1>

            <p
              className={`mt-6 flex flex-wrap gap-x-3 gap-y-1 text-sm font-bold ${light ? "text-black/70" : "text-white/80"}`}
            >
              {active.specs.map((spec, i) => (
                <span key={spec.label}>
                  {spec.label}: {spec.value}
                  {i < active.specs.length - 1 && <span className="mx-2 opacity-50">|</span>}
                </span>
              ))}
            </p>

            <p className={`mt-6 max-w-md text-base ${light ? "text-black/60" : "text-white/75"}`}>
              {active.description}
            </p>
          </div>

          <div>
            <p className={`text-4xl font-black ${light ? "text-black" : "text-white"}`}>
              ${active.price.toFixed(2)}
            </p>
            <button
              className={`mt-5 w-full rounded-full py-4 text-base font-bold tracking-wide uppercase transition hover:opacity-90 md:w-auto md:px-14 ${light ? "bg-black text-white" : "bg-white text-black"}`}
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-white px-8 py-16">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center">
            <div className="flex gap-4 md:flex-col">
              {PRODUCTS.map((product, i) => (
                <button
                  key={product.slug}
                  onClick={() => setActiveIndex(i)}
                  aria-label={product.name}
                  className="h-3 w-3 rounded-full transition-all duration-300"
                  style={{
                    background: product.accent,
                    opacity: i === activeIndex ? 1 : 0.3,
                    transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>

            <div className="flex w-full max-w-xl flex-col gap-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] bg-black/[0.03]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${active.slug}-${activeImageIndex}`}
                    className="absolute inset-0"
                    initial={{ scale: 0.55, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.55, opacity: 0 }}
                    transition={SPRING_SOFT}
                  >
                    <Image
                      src={active.images[activeImageIndex]}
                      alt={active.name}
                      fill
                      priority
                      className="object-contain"
                      sizes="(min-width: 768px) 42rem, 100vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-center gap-3">
                {active.images.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={i === activeImageIndex}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-black/[0.03] outline-none ring-inset transition ${
                      i === activeImageIndex ? "ring-2 ring-[#0a1220]" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={image} alt={`${active.name} view ${i + 1}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex max-w-xs flex-col gap-3 text-center md:max-w-[11rem] md:items-start md:text-left">
              <p className="font-display text-base text-black/55 italic">{active.tagline}</p>
              <button className="self-center text-sm underline underline-offset-4 md:self-start">
                Explore Collection
              </button>
            </div>
          </div>

          <button
            onClick={() => goTo(nextProduct.slug)}
            className="mt-10 flex w-full max-w-xs items-center gap-3 self-center rounded-2xl border border-black/10 p-3 text-left transition hover:border-black/25 md:self-end md:mr-4 lg:mr-14"
          >
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/[0.03]">
              <Image src={nextProduct.image} alt={nextProduct.name} fill className="object-cover" />
            </span>
            <span className="text-sm font-medium">{nextProduct.name}</span>
          </button>
        </div>
      </div>

      <section className="mt-24 px-6 md:px-16 lg:px-24">
        <h2
          className="font-display-showcase text-4xl leading-[0.95] uppercase text-[#0a1220] md:text-6xl"
          style={{ fontWeight: 900 }}
        >
          Maybe You&rsquo;ll <span className="text-[#c17a3d]">Love It</span>
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {getOtherProducts(active.slug).map((product) => {
            const cardLight = isLightColor(product.accent);
            return (
              <button
                key={product.slug}
                onClick={() => router.push(`/premium/${product.slug}`)}
                className="flex flex-col overflow-hidden rounded-[2rem] text-left transition hover:-translate-y-1"
                style={{ backgroundColor: product.accent }}
              >
                <div className="relative aspect-square w-full">
                  <span
                    className={`font-display-showcase absolute top-6 left-6 z-10 rounded-full px-3 py-1 text-[11px] tracking-widest uppercase ${cardLight ? "bg-black/10 text-black/70" : "bg-white/90 text-black/70"}`}
                    style={{ fontWeight: 700 }}
                  >
                    {product.badge}
                  </span>
                  <Image src={product.image} alt={product.name} fill className="object-contain p-10" />
                </div>
                <div className="px-6 pb-6">
                  <p className={`text-xl font-bold ${cardLight ? "text-black" : "text-white"}`}>
                    {product.name}
                  </p>
                  <p className={`mt-1 text-sm font-semibold ${cardLight ? "text-black/60" : "text-white/70"}`}>
                    ${product.price.toFixed(2)}
                  </p>
                  <span
                    className={`mt-4 flex w-full items-center justify-center rounded-full py-3 text-sm font-bold uppercase ${cardLight ? "bg-black text-white" : "bg-white text-black"}`}
                  >
                    Taste It
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <button
        onClick={goNext}
        aria-label="Next product"
        className="fixed top-1/2 right-6 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-lg transition hover:scale-105 md:flex"
      >
        <ChevronRight />
      </button>
    </main>
  );
}
