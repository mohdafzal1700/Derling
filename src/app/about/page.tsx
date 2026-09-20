import type { Metadata } from "next";
import { ExperienceNav } from "@/components/Experience/ExperienceNav";
import { ProductStory } from "@/components/Premium/ProductStory";
import { PhilosophyReveal } from "@/components/Premium/PhilosophyReveal";
import { TickerBanner } from "@/components/Premium/TickerBanner";
import { TextUnfoldReveal } from "@/components/Premium/TextUnfoldReveal";
import { ProcessSteps } from "@/components/Premium/ProcessSteps";
import { CommitmentsGrid } from "@/components/Premium/CommitmentsGrid";

export const metadata: Metadata = {
  title: "About — Derlings",
  description: "The story behind Derlings — small batches, real ingredients, no shortcuts.",
};

export default function About() {
  return (
    <>
      <ExperienceNav />
      <main className="min-h-screen bg-[#f7e6d6]">
        <ProductStory image="/about/women.jpeg" />
        <PhilosophyReveal />
        <TickerBanner />

        <section className="flex min-h-[50vh] w-full items-center justify-center bg-[#f7e6d6] px-6 py-24 text-center md:px-16">
          <TextUnfoldReveal
            text="Every Sweet Craving, One Honest Cup."
            className="font-display-showcase max-w-4xl text-3xl leading-[1.05] text-[#0a1220] uppercase md:text-6xl"
          />
        </section>

        <ProcessSteps />
        <CommitmentsGrid />
      </main>
    </>
  );
}
