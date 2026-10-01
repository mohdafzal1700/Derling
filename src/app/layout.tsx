import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Plus_Jakarta_Sans, Syne } from "next/font/google";
import { GlobalFluidLayer } from "@/components/Fluid/GlobalFluidLayer";
import { ExperienceFooter } from "@/components/Experience/ExperienceFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial display serif for /experience's headlines — everything else on
// the site stays on the grotesk (Geist); this is deliberately scoped to
// feel like a distinct, more cinematic register, not a site-wide change.
// Stands in for Canela/PP Editorial New (both paid, no license on hand) —
// Fraunces' high optical-size contrast and sharp terminals read much closer
// to that brief than Cormorant Garamond's classic-book-serif feel.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

// Loaded globally (not scoped to /experience) because the showcase nav and
// ExperienceFooter — both mounted site-wide — need font-display-showcase /
// font-body-showcase available on every page, not just the cinematic ones.
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

export const metadata: Metadata = {
  title: "Derlings — It's a New Habit",
  description: "Premium chilled desserts, made for everyday indulgence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${syne.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GlobalFluidLayer />
        <div className="ui-layer flex min-h-full flex-col">
          <div className="flex-1">{children}</div>
          <ExperienceFooter />
        </div>
      </body>
    </html>
  );
}
