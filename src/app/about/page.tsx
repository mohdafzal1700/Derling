import type { Metadata } from "next";
import { ExperienceNav } from "@/components/Experience/ExperienceNav";
import { ProductStory } from "@/components/Premium/ProductStory";
import { PhilosophyReveal } from "@/components/Premium/PhilosophyReveal";
import { TickerBanner } from "@/components/Premium/TickerBanner";
import { ProcessSteps } from "@/components/Premium/ProcessSteps";
import { CommitmentsGrid } from "@/components/Premium/CommitmentsGrid";
import { TeamSection } from "@/components/Premium/TeamSection";

export const metadata: Metadata = {
  title: "About — Derlings",
  description: "The story behind Derlings — small batches, real ingredients, no shortcuts.",
};

export default function About() {
  return (
    <>
      <ExperienceNav />
      <main className="min-h-screen bg-showcase-cream">
        <ProductStory image="/about/women.jpeg" />
        <PhilosophyReveal />
        <TickerBanner />

        <ProcessSteps />
        <CommitmentsGrid />
        <TeamSection />
      </main>
    </>
  );
}
