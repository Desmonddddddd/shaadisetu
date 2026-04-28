import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getVendorsForListing } from "@/lib/queries/vendors";
import { VendorListingFilters } from "@/components/vendor/VendorListingFilters";
import { VendorListingResults } from "@/components/vendor/VendorListingResults";

interface Params {
  city: string;
  category: string;
}

export default async function VendorListing({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city, category } = await params;
  const cityRow = await db.city.findUnique({ where: { slug: city } });
  const categoryRow = await db.category.findUnique({ where: { id: category } });
  if (!cityRow || !categoryRow) notFound();

  const vendors = await getVendorsForListing({
    cityId: cityRow.id,
    categoryId: categoryRow.id,
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <header className="mb-3">
        <h1 className="text-2xl font-semibold text-slate-900">
          {categoryRow.name} in {cityRow.name}
        </h1>
        <p className="text-sm text-slate-600">{vendors.length} vendors</p>
      </header>

      <VendorListingFilters cityName={cityRow.name} categoryName={categoryRow.name} />
      <VendorListingResults vendors={vendors} />
    </main>
  );
}
