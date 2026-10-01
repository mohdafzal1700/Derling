"use client";

import { useState } from "react";

const EMAIL = "derlingstoyou@gmail.com";

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
    <form onSubmit={handleSubmit} className="font-body-showcase text-showcase-navy">
      <p className="mb-2 text-[12px] font-semibold tracking-[0.3em] text-showcase-navy/65 uppercase">
        <span className="mr-3 text-caramel">01</span>Your details
      </p>
      <div className="grid gap-x-10 sm:grid-cols-2">
        <Field id="name" label="Your name" required autoComplete="name" />
        <Field id="phone" label="Phone" type="tel" autoComplete="tel" />
        <Field id="email" label="Email address" type="email" required autoComplete="email" className="sm:col-span-2" />
      </div>

      <p className="mt-12 mb-2 text-[12px] font-semibold tracking-[0.3em] text-showcase-navy/65 uppercase">
        <span className="mr-3 text-caramel">02</span>Your message
      </p>
      <Field id="message" label="Tell us what you have in mind" multiline />

      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="group inline-flex items-center gap-4 self-start rounded-full bg-showcase-navy py-2.5 pr-8 pl-2.5 text-[13px] font-bold tracking-[0.14em] text-showcase-cream uppercase shadow-[0_10px_30px_rgba(30,44,76,0.25)] transition-colors duration-500 hover:bg-caramel"
        >
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-full bg-showcase-cream text-[17px] leading-none text-showcase-navy transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
          Send enquiry
        </button>
        <p className="text-[13px] text-showcase-navy/65">
          Or write to{" "}
          <a href={`mailto:${EMAIL}`} className="font-medium text-showcase-navy underline-offset-4 hover:text-caramel hover:underline">
            {EMAIL}
          </a>
        </p>
      </div>

      <p aria-live="polite" className="mt-5 min-h-[20px] text-[13px] text-showcase-navy/55">
        {sent ? `Your mail app should now be open with the message ready — if not, write to us at ${EMAIL}.` : ""}
      </p>
    </form>
  );
}

/**
 * Underline field with a floating label: the label sits in the field until
 * it's focused or filled (`placeholder-shown` does the tracking, so no
 * state), and a caramel rule draws across from the left on focus.
 */
function Field({
  id,
  label,
  type = "text",
  required,
  autoComplete,
  multiline,
  className = "",
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  multiline?: boolean;
  className?: string;
}) {
  const inputClass =
    "peer block w-full border-0 border-b border-showcase-navy/30 bg-transparent px-0 pt-7 pb-3 text-[17px] font-medium text-showcase-navy placeholder-transparent outline-none transition-colors duration-300 hover:border-showcase-navy/55";

  return (
    <div className={`relative ${className}`}>
      {multiline ? (
        <textarea id={id} name={id} rows={3} placeholder=" " title="" className={`${inputClass} resize-none`} />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder=" "
          title=""
          className={inputClass}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-1 left-0 origin-left text-[11px] font-semibold tracking-[0.12em] text-showcase-navy/70 uppercase transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-placeholder-shown:top-7 peer-placeholder-shown:text-[17px] peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:text-[11px] peer-focus:tracking-[0.12em] peer-focus:text-caramel peer-focus:uppercase"
      >
        {label}
        {required && <span className="text-caramel"> *</span>}
      </label>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-caramel transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100"
      />
    </div>
  );
}
