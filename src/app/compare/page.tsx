import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { getVendorProfilesByIds } from "@/lib/queries/vendors";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids: idsParam } = await searchParams;
  const ids = (idsParam ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  const vendors = await getVendorProfilesByIds(ids);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">Compare Vendors</h1>
      <ComparisonTable vendors={vendors} />
    </main>
  );
}
