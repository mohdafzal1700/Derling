"use client";

import { useState } from "react";

const EMAIL = "derlingstoyou@gmail.com";

const FIELD_CLASS =
  "font-body-showcase w-full rounded-2xl border border-showcase-navy/15 bg-white/60 px-5 py-4 text-[15px] text-showcase-navy placeholder:text-showcase-navy/35 outline-none transition-colors duration-300 focus:border-caramel focus:bg-white";

const LABEL_CLASS =
  "font-body-showcase mb-2 block text-[15px] font-medium text-showcase-navy/80";

/**
 * There is no mail/CRM backend wired up on this project yet, so the form
 * composes the enquiry into a mailto: to the Derlings inbox — the same
 * address the footer wordmark links to. Swap `handleSubmit` for a Server
 * Action once a delivery service exists; the markup stays as-is.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    const body = [
      `Name: ${name}`,
      phone && `Phone: ${phone}`,
      `Email: ${email}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      `New enquiry from ${name}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL_CLASS}>
            Name*
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Enter your name"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label htmlFor="phone" className={LABEL_CLASS}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Enter your phone number"
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={LABEL_CLASS}>
          Your digital address*
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Enter your email"
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <label htmlFor="message" className={LABEL_CLASS}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Tell us your idea"
          className={`${FIELD_CLASS} resize-y`}
        />
      </div>

      <button
        type="submit"
        className="font-display-showcase mt-1 w-full rounded-2xl bg-caramel py-5 text-[15px] font-extrabold tracking-[0.15em] text-showcase-cream uppercase shadow-[0_14px_40px_rgba(200,155,88,0.35)] transition-colors duration-500 hover:bg-showcase-navy"
      >
        Submit
      </button>

      <p
        aria-live="polite"
        className="font-body-showcase min-h-[22px] text-[13px] text-showcase-navy/50"
      >
        {sent
          ? `Your mail app should be open with the message ready — if not, write to us at ${EMAIL}.`
          : ""}
      </p>
    </form>
  );
}
