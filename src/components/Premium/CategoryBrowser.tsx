"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES } from "@/data/categories";
import { ALL_PRODUCTS } from "@/data/products";

type PriceFilter = "any" | "under6" | "over6";

/** Sidebar filters (category checkboxes + price) driving the product grid — no page navigation. */
export function CategoryBrowser() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [price, setPrice] = useState<PriceFilter>("any");

  const toggleCategory = (slug: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const matches = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const categoryOk = checked.size === 0 || checked.has(product.category);
      const priceOk = price === "any" || (price === "under6" ? product.price < 6 : product.price >= 6);
      return categoryOk && priceOk;
    });
  }, [checked, price]);

  const activeNames = CATEGORIES.filter((c) => checked.has(c.slug)).map((c) => c.name);
  const heading = activeNames.length === 1 ? activeNames[0] : activeNames.length > 1 ? "Selected Flavors" : "All Flavors";
  const tagline =
    activeNames.length === 1
      ? (CATEGORIES.find((c) => c.name === activeNames[0])?.tagline ?? "")
      : "Small batches, real cream, no shortcuts.";
  const filterKey = `${[...checked].sort().join(",")}-${price}`;

  return (
    <section className="w-full bg-showcase-cream py-16">
      <h2
        className="font-display-showcase px-6 text-2xl tracking-tight text-[#0a1220] uppercase md:px-12 md:text-3xl"
        style={{ fontWeight: 800 }}
      >
        Shop by <span className="text-[#c17a3d]">Category</span>
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-10 px-6 md:px-12 lg:grid-cols-[220px_1fr] lg:gap-12">
        {/* Sidebar filters — a glass panel: translucent, blurred, with a soft
            border/shadow, instead of plain text sitting on the page. */}
        <aside
          className="rounded-2xl border border-white/70 p-6 shadow-[0_20px_50px_-24px_rgba(10,18,32,0.2)] backdrop-blur-md lg:sticky lg:top-24 lg:self-start"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 100%)",
          }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-black/40 uppercase">
            Filter ({checked.size + (price !== "any" ? 1 : 0)})
          </p>

          <div className="mt-5 border-t border-white/60 pt-5">
            <p className="font-display-showcase text-sm text-[#0a1220] uppercase" style={{ fontWeight: 800 }}>
              Category
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {CATEGORIES.map((category) => (
                <label key={category.slug} className="flex cursor-pointer items-center gap-2.5 text-sm text-black/70">
                  <input
                    type="checkbox"
                    checked={checked.has(category.slug)}
                    onChange={() => toggleCategory(category.slug)}
                    className="h-4 w-4 rounded border-black/20 accent-[#c17a3d]"
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-white/60 pt-5">
            <p className="font-display-showcase text-sm text-[#0a1220] uppercase" style={{ fontWeight: 800 }}>
              Price
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {(
                [
                  { key: "any", label: "Any price" },
                  { key: "under6", label: "Under ₹6" },
                  { key: "over6", label: "₹6 & above" },
                ] as { key: PriceFilter; label: string }[]
              ).map((option) => (
                <label key={option.key} className="flex cursor-pointer items-center gap-2.5 text-sm text-black/70">
                  <input
                    type="radio"
                    name="price"
                    checked={price === option.key}
                    onChange={() => setPrice(option.key)}
                    className="h-4 w-4 border-black/20 accent-[#c17a3d]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={heading}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3
                className="font-display-showcase text-3xl leading-[0.95] uppercase text-[#0a1220] md:text-5xl"
                style={{ fontWeight: 900 }}
              >
                {heading}
              </h3>
              <p className="font-display mt-3 max-w-md text-base text-black/50 italic md:text-lg">{tagline}</p>
            </motion.div>
          </AnimatePresence>

          {matches.length === 0 ? (
            <p className="mt-6 text-sm text-black/50">No flavors match those filters yet.</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={filterKey}
                initial="hidden"
                animate="visible"
                className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {matches.map((product, i) => (
                  <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={`/premium/${product.slug}`}
                      className="group flex flex-col text-left transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-[6/5] w-full overflow-hidden rounded-2xl bg-[#efece5]">
                        {/* Frosted-glass shade behind the product. Backdrop-blur
                            needs actual detail behind it to visibly blur —
                            a flat color has none — so two oversized, sharply
                            blurred color blobs sit underneath, and the glass
                            layer on top smears them into genuine frosted
                            texture instead of just tinting flat. */}
                        <div
                          aria-hidden
                          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-60"
                        >
                          <div
                            className="absolute -top-1/4 -left-1/4 h-3/4 w-3/4 rounded-full blur-3xl"
                            style={{ backgroundColor: product.accent }}
                          />
                          <div
                            className="absolute -right-1/4 -bottom-1/4 h-3/4 w-3/4 rounded-full blur-3xl"
                            style={{ backgroundColor: product.accent, opacity: 0.7 }}
                          />
                        </div>
                        <div
                          aria-hidden
                          className="absolute inset-0 opacity-0 backdrop-blur-xl transition-opacity duration-500 group-hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(160deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.3) 100%)",
                          }}
                        />
                        <div
                          aria-hidden
                          className="absolute inset-0 rounded-2xl opacity-0 ring-1 ring-white/70 transition-opacity duration-500 group-hover:opacity-100"
                        />

                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="relative object-contain p-10 transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* "View Flavor" pill — slides up into place on hover. */}
                        <span className="font-display-showcase absolute inset-x-4 bottom-4 translate-y-3 rounded-full bg-black py-2.5 text-center text-xs tracking-widest text-white uppercase opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          View Flavor
                        </span>
                      </div>

                      <div className="mt-4 flex items-baseline justify-between gap-3">
                        <p className="text-sm font-medium text-black transition-colors duration-300 group-hover:text-[#c17a3d]">
                          {product.name}
                        </p>
                        <p className="text-sm font-bold text-black">&#8377;{product.price.toFixed(2)}</p>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-black/50">{product.description}</p>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
