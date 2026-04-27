import HeroSection from "@/components/HeroSection";
import CategoriesGrid from "@/components/CategoriesGrid";
import HowItWorks from "@/components/HowItWorks";
import PopularCities from "@/components/PopularCities";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesGrid />
      <HowItWorks />
      <PopularCities />
    </>
  );
}
