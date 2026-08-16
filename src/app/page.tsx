import { Experience } from "@/components/Experience/Experience";
import { BoldRevealSection } from "@/components/Experience/sections/BoldRevealSection";
import { PartnerSection } from "@/components/Experience/sections/PartnerSection";

export default function Home() {
  return (
    <>
      <Experience />
      <BoldRevealSection />
      <PartnerSection />
    </>
  );
}
