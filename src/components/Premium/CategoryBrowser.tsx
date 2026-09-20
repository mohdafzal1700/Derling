"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { ALL_PRODUCTS } from "@/data/products";
import { isLightColor } from "@/lib/color";

/** Category rail + product grid, switching in place on click — no page navigation. */
export function CategoryBrowser() {
  const [selected, setSelected] = useState(CATEGORIES[0].slug);
  const activeCategory = CATEGORIES.find((c) => c.slug === selected) ?? CATEGORIES[0];
  const matches = ALL_PRODUCTS.filter((product) => product.category === selected);

  return (
    <section className="w-full bg-white py-16">
      <h2
        className="font-display-showcase px-6 text-2xl tracking-tight text-[#0a1220] uppercase md:px-12 md:text-3xl"
        style={{ fontWeight: 800 }}
      >
        Shop by <span className="text-[#c17a3d]">Category</span>
      </h2>

      <div className="mt-10 grid grid-flow-col grid-rows-1 auto-cols-[3.5rem] gap-4 overflow-x-auto px-6 pb-4 md:auto-cols-[4rem] md:gap-6 md:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((category) => {
          const isActive = category.slug === selected;
          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => setSelected(category.slug)}
              aria-pressed={isActive}
              className="group flex flex-col items-center gap-2 outline-none"
            >
              <div
                className={`relative aspect-square w-full overflow-hidden rounded-full ring-inset transition group-focus-visible:ring-2 group-focus-visible:ring-[#0a1220] ${
                  isActive ? "bg-[#0a1220]" : "bg-black/[0.04] group-hover:bg-black/[0.08]"
                }`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className={`object-contain p-1.5 transition ${isActive ? "brightness-0 invert" : ""}`}
                  sizes="64px"
                />
              </div>
              <p
                className={`text-center text-[9px] leading-tight tracking-wide uppercase md:text-[10px] ${
                  isActive ? "font-display-showcase text-[#0a1220]" : "font-display-showcase text-black/50"
                }`}
                style={isActive ? { fontWeight: 800 } : undefined}
              >
                {category.name}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-10 px-6 md:px-12">
        <h3
          className="font-display-showcase text-3xl leading-[0.95] uppercase text-[#0a1220] md:text-5xl"
          style={{ fontWeight: 900 }}
        >
          {activeCategory.name}
        </h3>

        {matches.length === 0 ? (
          <p className="mt-6 text-sm text-black/50">More treats coming to this category soon.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {matches.map((product) => {
              const light = isLightColor(product.accent);
              return (
                <Link
                  key={product.slug}
                  href={`/premium/${product.slug}`}
                  className="flex flex-col overflow-hidden rounded-[2rem] text-left transition hover:-translate-y-1"
                  style={{ backgroundColor: product.accent }}
                >
                  <div className="relative aspect-square w-full">
                    <span
                      className={`font-display-showcase absolute top-6 left-6 z-10 rounded-full px-3 py-1 text-[11px] tracking-widest uppercase ${light ? "bg-black/10 text-black/70" : "bg-white/90 text-black/70"}`}
                      style={{ fontWeight: 700 }}
                    >
                      {product.badge}
                    </span>
                    <Image src={product.image} alt={product.name} fill className="object-contain p-10" />
                  </div>
                  <div className="px-6 pb-6">
                    <p className={`text-xl font-bold ${light ? "text-black" : "text-white"}`}>{product.name}</p>
                    <p className={`mt-1 text-sm font-semibold ${light ? "text-black/60" : "text-white/70"}`}>
                      ${product.price.toFixed(2)}
                    </p>
                    <span
                      className={`mt-4 flex w-full items-center justify-center rounded-full py-3 text-sm font-bold uppercase ${light ? "bg-black text-white" : "bg-white text-black"}`}
                    >
                      Taste It
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
