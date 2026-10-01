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
        <div className="grid lg:grid-cols-12">
          {/* Photo panel: pinned beside the form on desktop, carrying the
              direct contact details so the form column stays uncluttered. */}
          <aside className="p-3 lg:sticky lg:top-[88px] lg:col-span-5 lg:h-[calc(100svh-104px)] lg:self-start lg:pt-0">
            <Reveal className="h-full">
              <div className="relative mt-20 h-[60svh] overflow-hidden lg:mt-0 rounded-[28px] lg:h-full">
                <Image
                  src="/photo_3_2026-08-07_16-57-49.jpg"
                  alt="A hand holding a cup of Derlings Signature Caramel Pudding"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1220]/85 via-[#0a1220]/15 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-showcase-cream md:p-9">
                  <p className="font-body-showcase mb-3 text-[11px] font-medium tracking-[0.3em] text-showcase-cream/55 uppercase">
                    Visit the kitchen
                  </p>
                  <p className="font-body-showcase max-w-[340px] text-[15px] leading-[1.6] text-showcase-cream/85">
                    Ground Floor, Pushpamangalam, Service Rd, near Bhima Jewellery, Edappally, Kochi
                  </p>
                  <ul className="mt-7 grid grid-cols-3 border-t border-showcase-cream/15 pt-5">
                    {DETAILS.filter((d) => d.label !== "Email").map((detail) => (
                      <li key={detail.label}>
                        <a
                          href={detail.href}
                          target={detail.href.startsWith("http") ? "_blank" : undefined}
                          rel={detail.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="font-body-showcase group block"
                        >
                          <span className="block text-[10px] font-medium tracking-[0.28em] text-showcase-cream/45 uppercase">
                            {detail.label}
                          </span>
                          <span className="mt-1.5 block text-[14px] text-showcase-cream transition-colors duration-300 group-hover:text-caramel">
                            {detail.value}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </aside>

          <section className="px-5 pt-16 pb-24 md:px-10 lg:col-span-7 lg:px-16 lg:pt-36 xl:px-24">
            <div className="max-w-[640px]">
              <Reveal variant="label">
                <p className="font-body-showcase mb-5 text-[12px] font-semibold tracking-[0.35em] text-showcase-navy/55 uppercase">
                  Contact
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  style={{ fontWeight: 800 }}
                  className="type-condensed font-display-showcase text-[14vw] leading-[0.9] uppercase md:text-[5.5rem]"
                >
                  Let&rsquo;s <span className="text-caramel">talk</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="font-body-showcase mt-6 max-w-[460px] text-[16px] leading-[1.7] text-showcase-navy/75">
                  Retailer, supermarket, café, bakery or distributor — tell us what you have in mind
                  and we&rsquo;ll get back to you within two working days.
                </p>
              </Reveal>

              <Reveal delay={0.15} className="mt-14">
                <ContactForm />
              </Reveal>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
