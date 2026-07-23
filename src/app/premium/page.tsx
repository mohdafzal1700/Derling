import type { Metadata } from "next";
import { Hero } from "@/components/Premium/Hero";

export const metadata: Metadata = {
  title: "Derlings — Signature Collection",
  description: "An interactive, cinematic hero for the Derlings dessert lineup.",
};

export default function PremiumPage() {
  return <Hero />;
}
