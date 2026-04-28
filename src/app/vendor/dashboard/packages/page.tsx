import { requireVendorSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { PackagesEditor } from "./PackagesEditor";

export default async function DashboardPackagesPage() {
  const { vendorId } = await requireVendorSession();
  const rows = await db.package.findMany({
    where: { vendorId },
    orderBy: { price: "asc" },
  });
  const packages = rows.map((p) => {
    let features: string[] = [];
    try {
      const v = JSON.parse(p.features);
      if (Array.isArray(v)) features = v.filter((x): x is string => typeof x === "string");
    } catch { /* ignore */ }
    return {
      id: p.id,
      tier: p.tier,
      name: p.name,
      price: p.price,
      features,
      popular: p.popular,
    };
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Packages</h1>
      <PackagesEditor initial={packages} />
    </div>
  );
}
