import { findCategoryBySlug } from "@/lib/slugs";
import type { Vendor } from "@/data/vendors";

export function VendorServicesList({ vendor }: { vendor: Vendor }) {
  const category = findCategoryBySlug(vendor.categoryId);
  const services = category?.subcategories ?? [];
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
