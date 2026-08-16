import Image from "next/image";
import { Reveal } from "./Reveal";

const EMAIL = "derlingstoyou@gmail.com";

const COLUMNS = [
  {
    heading: "Explore",
    links: [{ label: "Partner With Us", href: "#partner" }],
  },
  {
    heading: "Get in Touch",
    links: [
      { label: "Phone", href: "tel:+916238127960" },
      { label: "WhatsApp", href: "https://wa.me/916238127960" },
    ],
  },
  {
    heading: "Follow",
    links: [{ label: "Instagram", href: "https://instagram.com/derlings_" }],
  },
];

export function ExperienceFooter() {
  return (
    <footer id="contact" className="relative z-10 overflow-hidden bg-navy text-cream">
      <div className="px-6 pt-14 pb-10 md:px-12 md:pt-16 md:pb-12">
        <Reveal variant="label">
          <p className="font-body-showcase text-[12px] font-medium tracking-[0.35em] text-cream/35 uppercase">
            Say Hello
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          {/* Rendered as SVG so the address spans the full container width
              exactly, edge to edge — a vw-based font-size overflows on long
              addresses and forces the whole page to scroll sideways. */}
          <a
            href={`mailto:${EMAIL}`}
            aria-label={`Email ${EMAIL}`}
            className="mt-5 block text-cream transition-colors duration-500 hover:text-caramel"
          >
            <svg viewBox="0 0 1000 112" className="block h-auto w-full" role="img">
              <text
                x="0"
                y="88"
                textLength="1000"
                lengthAdjust="spacingAndGlyphs"
                fontSize="118"
                fontWeight="800"
                fill="currentColor"
                className="font-display-showcase"
              >
                {EMAIL.toUpperCase()}
              </text>
            </svg>
          </a>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-cream/10 px-6 py-12 md:grid-cols-4 md:px-12 md:py-14">
        {COLUMNS.map((column) => (
          <Reveal key={column.heading}>
            <p className="font-body-showcase mb-6 text-[11px] font-medium tracking-[0.25em] text-cream/35 uppercase">
              {column.heading}
            </p>
            <ul className="flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body-showcase text-[15px] text-cream/80 transition-colors duration-500 hover:text-caramel"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal>
          <p className="font-body-showcase mb-6 text-[11px] font-medium tracking-[0.25em] text-cream/35 uppercase">
            Visit
          </p>
          <p className="font-body-showcase max-w-[240px] text-[15px] leading-[1.7] text-cream/80">
            Ground Floor, Pushpamangalam, Service Rd, Near Bhima Jwellery, Edappally, Kochi
          </p>
        </Reveal>
      </div>

      <div className="flex flex-col items-center justify-between gap-5 border-t border-cream/10 px-6 py-6 md:flex-row md:px-12">
        <Image
          src="/derlings-logo.svg"
          alt="Derlings"
          width={140}
          height={79}
          className="h-7 w-auto brightness-0 invert"
        />
        <p className="font-body-showcase text-[11px] tracking-[0.15em] text-cream/35 uppercase">
          {`© ${new Date().getFullYear()} Derlings — It’s a New Habit.`}
        </p>
      </div>
    </footer>
  );
}
