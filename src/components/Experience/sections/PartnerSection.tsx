import Image from "next/image";
import { Reveal } from "../Reveal";
import { MagneticButton } from "../MagneticButton";

export function PartnerSection() {
  return (
    <section id="partner" className="relative z-10 bg-chocolate">
      <div className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden px-6 py-24 md:px-12 md:py-28">
        <Image
          src="/letgrow.png"
          alt="Derlings desserts spread, an invitation to partner and grow together"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-chocolate/25" />

        <Reveal className="relative z-10 mx-auto w-full max-w-5xl rounded-[32px] bg-showcase-cream px-8 py-12 text-center shadow-[0_40px_100px_rgba(0,0,0,0.4)] md:px-24 md:py-14">
          <Reveal variant="label">
            <p className="font-body-showcase mb-5 text-[12px] font-medium tracking-[0.35em] text-showcase-navy/40 uppercase">
              Partner With Us
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              style={{ fontWeight: 800 }}
              className="font-display-showcase text-[9vw] leading-[0.95] tracking-[-0.02em] text-caramel uppercase sm:text-[6vw] md:text-[3.75rem]"
            >
              Let&rsquo;s grow together
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-body-showcase mx-auto mt-6 max-w-[520px] text-[15px] leading-[1.7] text-showcase-navy/55">
              We&rsquo;re looking to partner with retailers, supermarkets, cafés, bakeries and
              distributors who share our vision of bringing premium refrigerated foods to more
              customers.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex justify-center">
              <MagneticButton
                href="#contact"
                className="font-body-showcase group inline-flex items-center gap-4 rounded-full bg-caramel py-2.5 pr-10 pl-2.5 text-[14px] font-bold tracking-[0.06em] text-showcase-cream uppercase shadow-[0_10px_30px_rgba(200,155,88,0.35)] transition-colors duration-500 hover:bg-showcase-navy"
              >
                <span
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-showcase-cream text-[18px] leading-none text-caramel transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
                Get in Touch
              </MagneticButton>
            </div>
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
}
