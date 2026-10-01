"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { PRODUCTS } from "@/data/products";
import { isLightColor } from "@/lib/color";

const count = PRODUCTS.length;

/** Shortest signed distance from a to b around a circle of the given length. */
function circularDelta(a: number, b: number, length: number) {
  let d = (b - a) % length;
  if (d > length / 2) d -= length;
  if (d < -length / 2) d += length;
  return d;
}

/**
 * Circular carousel: the current product sits centered, its neighbors peek
 * in from the right (next) and left (previous), wrapping around indefinitely
 * so there's no first/last card with an empty side. The section is tall
 * (one viewport per product) with a sticky inner view — scrolling through
 * that height drives a continuous "progress" value, which is then eased
 * toward with a per-frame lerp so the cards glide instead of snapping.
 */
export function ProductGallery() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  const goToProduct = (slug: string) => router.push(`/premium/${slug}`);

  const scrollToProgress = (target: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const sectionTop = window.scrollY + rect.top;
    const clamped = Math.min(count - 1, Math.max(0, target));
    window.scrollTo({
      top: sectionTop + (clamped / (count - 1)) * total,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const activeIndex = Math.round(displayProgress + count) % count;
  const goToIndex = (i: number) => scrollToProgress(((i % count) + count) % count);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      targetProgressRef.current = progress * (count - 1);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (prefersReducedMotion) {
      setDisplayProgress(targetProgressRef.current);
      return () => window.removeEventListener("scroll", onScroll);
    }

    let raf = 0;
    const tick = () => {
      setDisplayProgress((prev) => {
        const diff = targetProgressRef.current - prev;
        return Math.abs(diff) < 0.001 ? prev : prev + diff * 0.09;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  const cards = useMemo(
    () =>
      PRODUCTS.map((product, i) => ({
        product,
        offset: circularDelta(displayProgress, i, count),
      })),
    [displayProgress],
  );

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: `${count * 100}vh` }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white">
        <h2
          className="font-display-showcase hover-shake absolute inset-x-0 top-28 z-30 cursor-default text-center text-3xl tracking-tight text-[#0a1220] uppercase md:text-5xl"
          style={{ fontWeight: 900 }}
        >
          Taste the <span className="text-[#c17a3d]">Habit.</span>
        </h2>

        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[10vw] bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[10vw] bg-gradient-to-l from-white to-transparent" />

        <div className="relative mt-32 h-[680px] w-full max-w-6xl">
          {cards.map(({ product, offset }) => {
            if (Math.abs(offset) > 1.4) return null;
            const light = isLightColor(product.accent);
            const proximity = 1 - Math.min(1, Math.abs(offset));
            const isCenter = Math.abs(offset) < 0.5;
            const scale = 0.62 + proximity * 0.43;

            const activate = () =>
              isCenter ? goToProduct(product.slug) : goToIndex(activeIndex + Math.round(offset));

            return (
              <div
                key={product.slug}
                onClick={activate}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") activate();
                }}
                className="group absolute top-1/2 left-1/2 flex w-[min(80vw,440px)] cursor-pointer flex-col overflow-hidden rounded-[2rem] p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]"
                style={{
                  backgroundColor: product.accent,
                  transform: `translate(-50%, -50%) translateX(${offset * 105}%) scale(${scale})`,
                  opacity: 0.35 + proximity * 0.65,
                  zIndex: 10 - Math.round(Math.abs(offset) * 10),
                }}
              >
                <span
                  className={`font-display-showcase self-start rounded-full px-3 py-1 text-[11px] tracking-widest uppercase ${light ? "bg-black/10 text-black/70" : "bg-white/90 text-black/70"}`}
                  style={{ fontWeight: 700 }}
                >
                  {product.badge}
                </span>
                <div className="relative mx-auto my-6 aspect-square w-[90%] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={`object-contain transition-transform duration-500 ease-out ${
                      offset >= 0
                        ? "group-hover:translate-x-[-4%] group-hover:scale-110"
                        : "group-hover:translate-x-[4%] group-hover:scale-110"
                    }`}
                    sizes="440px"
                  />
                </div>
                <div>
                  <p className={`text-3xl font-bold ${light ? "text-black" : "text-white"}`}>
                    {product.name}
                  </p>
                  <span
                    className={`mt-5 flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold transition ${light ? "bg-black text-white" : "bg-white text-black"}`}
                  >
                    Taste It
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-30 mt-4 flex items-center gap-8">
          <button
            onClick={() => goToIndex(activeIndex - 1)}
            aria-label="Previous product"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-lg text-black/60 transition hover:border-black/30 hover:text-black"
          >
            ‹
          </button>
          <div className="flex gap-2">
            {PRODUCTS.map((product, i) => (
              <button
                key={product.slug}
                aria-label={`Go to ${product.name}`}
                onClick={() => goToIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-6 bg-black/70" : "w-1.5 bg-black/20"}`}
              />
            ))}
          </div>
          <button
            onClick={() => goToIndex(activeIndex + 1)}
            aria-label="Next product"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-lg text-black/60 transition hover:border-black/30 hover:text-black"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
