import { db } from "@/lib/db";
import type { Vendor } from "@/types/vendor";

export async function VendorServicesList({ vendor }: { vendor: Vendor }) {
  const services = await db.subcategory.findMany({
    where: { categoryId: vendor.categoryId },
    orderBy: { name: "asc" },
  });
  if (services.length === 0) return null;
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Services Offered</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
        {services.map((s) => (
          <li key={s.id} className="flex gap-2 items-start">
            <span className="text-shaadi-deep">✓</span>
            {s.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
