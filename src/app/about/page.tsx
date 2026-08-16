import type { Metadata } from "next";
import { Navbar } from "@/components/Premium/Navbar";
import { ProductStory } from "@/components/Premium/ProductStory";

export const metadata: Metadata = {
  title: "About — Derlings",
  description: "The story behind Derlings — small batches, real ingredients, no shortcuts.",
};

export default function About() {
  return (
    <>
      <Navbar light />
      <main className="min-h-screen bg-[#f7e6d6]">
        <ProductStory image="/about/women.jpeg" />
      </main>
    </>
  );
}
