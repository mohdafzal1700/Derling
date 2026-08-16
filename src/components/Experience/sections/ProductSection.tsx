import Image from "next/image";
import { ProductFloat } from "@/components/Premium/ProductFloat";
import { Reveal } from "../Reveal";

export interface ProductSectionProps {
  id: string;
  eyebrow: string;
  name: string;
  tagline: string;
  highlights: string[];
  experience: string;
  imageSrc: string;
  imageAlt: string;
  /** Which side the product photo sits on at desktop widths. */
  imageSide: "left" | "right";
  /** Tailwind background class for the section — each flavour gets its own. */
  background: string;
  /** Tailwind text-color classes for this section (body copy tends dark or light depending on background). */
  textColor: string;
  mutedTextColor: string;
}

export function ProductSection({
  id,
  eyebrow,
  name,
  tagline,
  highlights,
  experience,
  imageSrc,
  imageAlt,
  imageSide,
  background,
  textColor,
  mutedTextColor,
}: ProductSectionProps) {
  return (
    <section id={id} className={`${background} px-6 py-28 md:py-36`}>
      <div
        className={`mx-auto flex max-w-5xl flex-col items-center gap-14 md:gap-20 ${
          imageSide === "left" ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        <div className="w-full md:w-1/2">
          <ProductFloat amplitude={6} rotate={1.2} duration={8}>
            <div className="relative aspect-[4/5] w-full max-w-[420px] mx-auto overflow-hidden rounded-[2px]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 420px, 90vw"
              />
            </div>
          </ProductFloat>
        </div>

        <div className={`w-full text-center md:w-1/2 md:text-left ${textColor}`}>
          <Reveal variant="label">
            <p className={`mb-5 text-[12px] tracking-[0.35em] uppercase ${mutedTextColor}`}>{eyebrow}</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl leading-[1.05] font-medium md:text-5xl">{name}</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className={`mt-5 max-w-[420px] text-[15px] leading-[1.75] md:mx-0 mx-auto ${mutedTextColor}`}>
              {tagline}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mx-auto mt-8 flex max-w-[420px] flex-col gap-2.5 text-left md:mx-0">
              {highlights.map((item) => (
                <li key={item} className={`flex items-baseline gap-3 text-[14px] ${mutedTextColor}`}>
                  <span className="text-caramel">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mx-auto mt-9 max-w-[420px] border-t border-current/10 pt-6 md:mx-0">
              <p className={`text-[12px] tracking-[0.25em] uppercase ${mutedTextColor} opacity-70`}>
                Experience
              </p>
              <p className={`mt-3 text-[14px] leading-[1.75] ${mutedTextColor}`}>{experience}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
