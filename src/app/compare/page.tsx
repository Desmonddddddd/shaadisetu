import { ComparisonTable } from "@/components/compare/ComparisonTable";

export default function ComparePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">Compare Vendors</h1>
      <ComparisonTable />
    </main>
  );
}
