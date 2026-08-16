import { Reveal } from "../Reveal";

interface SubBrand {
  name: string;
  tagline: string;
  gradient: string;
  availableToday?: string[];
  comingSoon: string[];
}

const SUB_BRANDS: SubBrand[] = [
  {
    name: "Derlings",
    tagline: "Premium Chilled Indulgence",
    gradient: "from-chocolate via-caramel/70 to-beige",
    availableToday: ["Signature Caramel Pudding", "Strawberry Flan"],
    comingSoon: [
      "Chocolate Mousse",
      "Cheesecake Cups",
      "Fruit Yogurt",
      "Flavoured Milk",
      "Milkshakes",
      "Dessert Cups",
      "Cereal Cups",
    ],
  },
  {
    name: "Derlings+",
    tagline: "Functional Nutrition",
    gradient: "from-navy via-navy/70 to-beige",
    comingSoon: [
      "Greek Yogurt",
      "High Protein Yogurt",
      "Protein Pudding",
      "High Protein Flavoured Milk",
      "Overnight Oats",
      "High Protein Muesli Cups",
    ],
  },
  {
    name: "SALT'D",
    tagline: "Modern Kerala Snacking",
    gradient: "from-caramel via-beige to-cream",
    comingSoon: ["Banana Chips", "Tapioca Chips", "Roasted Nuts", "Peanuts", "Savoury Snack Cups"],
  },
  {
    name: "Derlings Daily",
    tagline: "Fresh Everyday Foods",
    gradient: "from-beige via-cream to-white",
    comingSoon: ["Bread", "Chapati", "Idli Batter", "Dosa Batter", "Parotta", "Fresh Dairy Products"],
  },
];

export function BeyondDessertsSection() {
  return (
    <section id="beyond-desserts" className="bg-navy px-6 py-32 text-cream md:py-44">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal variant="label">
          <p className="mb-6 text-[12px] tracking-[0.35em] text-cream/40 uppercase">
            Beyond Desserts
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl leading-[1.15] font-medium italic md:text-5xl">
            The future of Derlings.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-7 max-w-[460px] text-[15px] leading-[1.8] text-cream/55">
            Today, Derlings begins with premium chilled desserts. Tomorrow, we&rsquo;re building a
            complete refrigerated food brand that brings indulgence, nutrition and convenience
            together under one trusted name.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-x-16 gap-y-20 border-t border-cream/10 pt-16 md:grid-cols-2">
        {SUB_BRANDS.map((brand, i) => (
          <Reveal key={brand.name} delay={(i % 2) * 0.08}>
            <div>
              <div className={`h-32 w-full rounded-[2px] bg-gradient-to-br ${brand.gradient} opacity-80`} />
              <h3 className="font-display mt-6 text-2xl font-medium">{brand.name}</h3>
              <p className="mt-1 text-[13px] tracking-[0.1em] text-caramel uppercase">
                {brand.tagline}
              </p>

              {brand.availableToday && (
                <div className="mt-5">
                  <p className="text-[11px] tracking-[0.2em] text-cream/40 uppercase">
                    Available Today
                  </p>
                  <p className="mt-1.5 text-[14px] leading-[1.7] text-cream/70">
                    {brand.availableToday.join(" · ")}
                  </p>
                </div>
              )}

              <div className="mt-5">
                <p className="text-[11px] tracking-[0.2em] text-cream/40 uppercase">Coming Soon</p>
                <p className="mt-1.5 text-[14px] leading-[1.7] text-cream/55">
                  {brand.comingSoon.join(" · ")}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
