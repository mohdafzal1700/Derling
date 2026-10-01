import { Experience } from "@/components/Experience/Experience";
import { BoldRevealSection } from "@/components/Experience/sections/BoldRevealSection";
import { CollectionSection } from "@/components/Experience/sections/CollectionSection";
import { StockistsSection } from "@/components/Experience/sections/StockistsSection";
import { FaqSection } from "@/components/Experience/sections/FaqSection";
import { PartnerSection } from "@/components/Experience/sections/PartnerSection";

export default function Home() {
  return (
    <>
      <Experience />
      <BoldRevealSection />
      <CollectionSection />
      <StockistsSection />
      <FaqSection />
      <PartnerSection />
    </>
  );
}
