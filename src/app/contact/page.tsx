import type { Metadata } from "next";
import Image from "next/image";
import { ExperienceNav } from "@/components/Experience/ExperienceNav";
import { ContactForm } from "@/components/Experience/ContactForm";
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
      <main className="min-h-screen bg-showcase-cream text-showcase-navy">
        <div className="px-5 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
          {/* Same header rhythm as the home sections: kicker, condensed title, side note. */}
          <header className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal variant="label">
                <p className="font-body-showcase mb-5 text-[12px] font-medium tracking-[0.35em] text-showcase-navy/40 uppercase">
                  Contact
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  style={{ fontWeight: 800 }}
                  className="type-condensed font-display-showcase text-[13vw] leading-[0.9] uppercase md:text-[6.5rem]"
                >
                  Let&rsquo;s <span className="text-caramel">talk</span>
                </h1>
              </Reveal>
            </div>
            <Reveal delay={0.1} className="md:max-w-[340px] md:pb-3">
              <p className="font-body-showcase text-[15px] leading-[1.7] text-showcase-navy/55">
                Retailer, supermarket, café, bakery or distributor — tell us what you have in mind
                and we&rsquo;ll get back to you within two working days.
              </p>
            </Reveal>
          </header>

          <section className="grid gap-12 md:grid-cols-12 md:gap-10 lg:gap-14">
            <Reveal className="md:col-span-5 lg:col-span-4 xl:col-span-3">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px]">
                <Image
                  src="/photo_3_2026-08-07_16-57-49.jpg"
                  alt="A hand holding a cup of Derlings Signature Caramel Pudding"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 40vw, 100vw"
                  priority
                />
              </div>
            </Reveal>

            <Reveal delay={0.05} className="md:col-span-7 lg:col-span-5 xl:col-span-6">
              <ContactForm />
            </Reveal>

            {/* Own column from lg up so the row spans the page without the
                image or form growing; tucks under the form below that. */}
            <div className="md:col-span-7 md:col-start-6 lg:col-span-3 lg:col-start-auto">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-7 border-t border-showcase-navy/10 pt-8 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                {DETAILS.map((detail) => (
                  <div key={detail.label}>
                    <dt className="font-body-showcase mb-2 text-[11px] font-medium tracking-[0.25em] text-showcase-navy/40 uppercase">
                      {detail.label}
                    </dt>
                    <dd>
                      <a
                        href={detail.href}
                        className="font-body-showcase text-[15px] break-words text-showcase-navy/80 transition-colors duration-500 hover:text-caramel"
                      >
                        {detail.value}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
