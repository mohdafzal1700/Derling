import type { Metadata } from "next";
import { Experience } from "@/components/Experience/Experience";
import { BoldRevealSection } from "@/components/Experience/sections/BoldRevealSection";
import { PartnerSection } from "@/components/Experience/sections/PartnerSection";
import { ExperienceFooter } from "@/components/Experience/ExperienceFooter";

export const metadata: Metadata = {
  title: "Derlings — It's a New Habit",
  description: "A cinematic introduction to Derlings premium chilled desserts.",
};

export default function ExperiencePage() {
  return (
    <>
      <Experience />
      <BoldRevealSection />
      <PartnerSection />
      <ExperienceFooter />
    </>
  );
}
