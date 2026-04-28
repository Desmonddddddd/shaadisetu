import HeroSection from "@/components/HeroSection";
import EntryPaths from "@/components/EntryPaths";
import { ConciergeTeaser } from "@/components/concierge/ConciergeTeaser";
import TopVendors from "@/components/TopVendors";
import ShaadiSetuWay from "@/components/ShaadiSetuWay";

export default function Home() {
  return (
    <>
      <HeroSection />
      <EntryPaths />
      <ConciergeTeaser />
      <ShaadiSetuWay />
      <TopVendors />
    </>
  );
}
