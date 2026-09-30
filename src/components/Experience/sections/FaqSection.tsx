"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "../Reveal";

type Faq = { q: string; a: string };

/** Split into the two columns up front so each column keeps its own rhythm. */
const COLUMNS: Faq[][] = [
  [
    {
      q: "What is Derlings?",
      a: "Derlings is a Kochi-born dessert brand making premium refrigerated puddings, flans, custards and mousses — made in small batches, set slow and kept cold from our kitchen to your spoon.",
    },
    {
      q: "What flavours do you offer?",
      a: "Our Signature Range includes Signature Caramel Pudding, Pista Malai Pudding, Strawberry Flan and more, with new recipes joining the line-up across puddings, flans, custards, mousses, parfaits and cheesecakes.",
    },
    {
      q: "How long do Derlings desserts stay fresh?",
      a: "Each cup keeps for up to 5 days when refrigerated. Always check the date printed on the pack, and enjoy it chilled for the best texture.",
    },
    {
      q: "Do they need to be refrigerated?",
      a: "Yes. Our desserts are fresh, refrigerated products — keep them between 2–5°C and avoid leaving them out of the fridge for long.",
    },
    {
      q: "Where can I buy Derlings?",
      a: "Visit us at Ground Floor, Pushpamangalam, Service Rd, near Bhima Jewellery, Edappally, Kochi, or reach us on WhatsApp to find the stockist nearest to you.",
    },
  ],
  [
    {
      q: "What goes into your desserts?",
      a: "Real milk and cream, roasted nuts, fresh fruit and slow-cooked caramel. We keep our recipes simple and let the ingredients do the talking.",
    },
    {
      q: "How big is each cup?",
      a: "Each cup is 150g — a generous single serving that's just right after a meal or as an afternoon treat.",
    },
    {
      q: "Do you take bulk or event orders?",
      a: "Yes. For parties, weddings, corporate events or bulk orders, call or WhatsApp us on +91 62381 27960 and we'll help you plan quantities and flavours.",
    },
    {
      q: "Can my store or café stock Derlings?",
      a: "We'd love that. We partner with retailers, supermarkets, cafés, bakeries and distributors — get in touch through our Partner With Us form and our team will reach out.",
    },
    {
      q: "How can I contact you?",
      a: "Email derlingstoyou@gmail.com, call or WhatsApp +91 62381 27960, or follow @derlings_ on Instagram for new flavours and updates.",
    },
  ],
];

export function FaqSection() {
  // One open item across both columns, first one open by default like the reference.
  const [open, setOpen] = useState<string | null>("0-0");

  return (
    <section
      id="faq"
      className="relative z-10 bg-showcase-cream px-5 py-28 text-showcase-navy md:px-10 md:py-36"
    >
      <header className="mb-16 text-center md:mb-20">
        <Reveal variant="label">
          <p className="font-body-showcase mb-5 text-[12px] font-medium tracking-[0.35em] text-showcase-navy/40 uppercase">
            FAQ
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            style={{ fontWeight: 800 }}
            className="type-condensed type-condensed-center font-display-showcase text-[11vw] leading-[0.95] uppercase md:text-[5.5rem]"
          >
            All you need to know
          </h2>
        </Reveal>
      </header>

      <div className="mx-auto grid max-w-[1300px] items-start gap-4 md:grid-cols-2">
        {COLUMNS.map((items, col) => (
          <div key={col} className="flex flex-col gap-4">
            {items.map((item, i) => {
              const id = `${col}-${i}`;
              return (
                <Reveal key={id} delay={0.04 * i}>
                  <FaqItem
                    item={item}
                    id={id}
                    open={open === id}
                    onToggle={() => setOpen(open === id ? null : id)}
                  />
                </Reveal>
              );
            })}
          </div>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="font-body-showcase mt-16 text-center text-[15px] text-showcase-navy/60">
          Didn&rsquo;t find your answer? We&rsquo;re happy to help.{" "}
          <Link
            href="/contact"
            className="font-semibold text-caramel underline-offset-4 transition-colors hover:text-showcase-navy hover:underline"
          >
            Get in touch
          </Link>
        </p>
      </Reveal>
    </section>
  );
}

function FaqItem({
  item,
  id,
  open,
  onToggle,
}: {
  item: Faq;
  id: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${id}`;

  return (
    <div className="rounded-[14px] bg-showcase-navy text-showcase-cream shadow-[0_20px_50px_rgba(30,44,76,0.12)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left md:px-7 md:py-7"
      >
        <span className="font-body-showcase text-[17px] font-medium md:text-[20px]">{item.q}</span>
        <motion.svg
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          viewBox="0 0 16 16"
          className="h-4 w-4 shrink-0 text-caramel"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 6 8 10.5 12.5 6" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="font-body-showcase px-6 pb-7 text-[15px] leading-[1.7] text-showcase-cream/60 md:px-7">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
