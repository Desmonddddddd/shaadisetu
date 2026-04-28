import { notFound } from "next/navigation";
import { sampleVendors } from "@/data/vendors";
import { findCityBySlug, findCategoryBySlug } from "@/lib/slugs";
import { VendorListingFilters } from "@/components/vendor/VendorListingFilters";
import { VendorListingResults } from "@/components/vendor/VendorListingResults";

interface Params { city: string; category: string }

export default async function VendorListing({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city, category } = await params;
  const cityObj = findCityBySlug(city);
  const categoryObj = findCategoryBySlug(category);
  if (!cityObj || !categoryObj) notFound();

  const matching = sampleVendors.filter(
    (v) => v.categoryId === categoryObj.id && v.city === cityObj.name,
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <header className="mb-3">
        <h1 className="text-2xl font-semibold text-slate-900">
          {categoryObj.name} in {cityObj.name}
        </h1>
        <p className="text-sm text-slate-600">{matching.length} vendors</p>
      </header>

      <VendorListingFilters cityName={cityObj.name} categoryName={categoryObj.name} />
      <VendorListingResults vendors={matching} />
    </main>
  );
}
