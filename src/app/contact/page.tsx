import type { Metadata } from "next";
import Image from "next/image";
import { ExperienceNav } from "@/components/Experience/ExperienceNav";
import { ContactForm } from "@/components/Experience/ContactForm";
import { FitText } from "@/components/Experience/FitText";
import { Reveal } from "@/components/Experience/Reveal";

export const metadata: Metadata = {
  title: "Contact — Derlings",
  description:
    "Partner with Derlings — retailers, supermarkets, cafés, bakeries and distributors, say hello.",
};

const DETAILS = [
  { label: "Email", value: "derlingstoyou@gmail.com", href: "mailto:derlingstoyou@gmail.com" },
  { label: "Phone", value: "+91 62381 27960", href: "tel:+916238127960" },
  { label: "WhatsApp", value: "Message us", href: "https://wa.me/916238127960" },
  { label: "Instagram", value: "@derlings_", href: "https://instagram.com/derlings_" },
];

export default function Contact() {
  return (
    <>
      <ExperienceNav />
      <main className="min-h-screen bg-showcase-cream">
        {/* Full-bleed wordmark, the footer email treatment — one line only,
            so the glyphs stay a single consistent width. */}
        <section className="px-6 pt-32 pb-12 md:px-12 md:pt-40 md:pb-16">
          <Reveal>
            <h1 className="text-caramel">
              <FitText>LET&rsquo;S TALK</FitText>
            </h1>
          </Reveal>
        </section>

        <section className="grid gap-12 px-6 pb-24 md:grid-cols-2 md:gap-16 md:px-12 md:pb-28">
          <Reveal className="relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[32px]">
              <Image
                src="/photo_3_2026-08-07_16-57-49.jpg"
                alt="A hand holding a cup of Derlings Signature Caramel Pudding"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
          </Reveal>

          <div className="flex flex-col">
            <Reveal variant="label">
              <p className="font-body-showcase text-[12px] font-medium tracking-[0.35em] text-showcase-navy/40 uppercase">
                Say Hello
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="font-body-showcase mt-5 mb-10 max-w-[520px] text-[15px] leading-[1.7] text-showcase-navy/55">
                Retailer, supermarket, café, bakery or distributor — tell us what you have in mind
                and we&rsquo;ll get back to you within two working days.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-showcase-navy/10 px-6 py-14 md:grid-cols-4 md:px-12 md:py-16">
          {DETAILS.map((detail) => (
            <Reveal key={detail.label}>
              <p className="font-body-showcase mb-4 text-[11px] font-medium tracking-[0.25em] text-showcase-navy/35 uppercase">
                {detail.label}
              </p>
              <a
                href={detail.href}
                className="font-body-showcase text-[15px] break-words text-showcase-navy/80 transition-colors duration-500 hover:text-caramel"
              >
                {detail.value}
              </a>
            </Reveal>
          ))}
        </section>
      </main>
    </>
  );
}
