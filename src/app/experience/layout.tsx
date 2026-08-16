import { Plus_Jakarta_Sans, Syne } from "next/font/google";

// Scoped to /experience — the nav and the bold-reveal section use a
// display/body pairing distinct from the rest of the page (Fraunces/Geist),
// so these load here rather than in the root layout.
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${syne.variable} ${plusJakarta.variable}`}>{children}</div>;
}
