import { requireVendorSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ProfileForm } from "./ProfileForm";

export default async function DashboardProfilePage() {
  const { vendorId } = await requireVendorSession();
  const [vendor, cities] = await Promise.all([
    db.vendor.findUniqueOrThrow({
      where: { id: vendorId },
      select: {
        name: true,
        description: true,
        priceRange: true,
        tags: true,
        cityId: true,
      },
    }),
    db.city.findMany({ orderBy: { name: "asc" } }),
  ]);

  let parsedTags: string[] = [];
  try {
    const v = JSON.parse(vendor.tags);
    if (Array.isArray(v)) parsedTags = v.filter((x): x is string => typeof x === "string");
  } catch { /* ignore */ }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
      <ProfileForm
        initial={{
          name: vendor.name,
          description: vendor.description,
          priceRange: vendor.priceRange,
          tags: parsedTags,
          cityId: vendor.cityId,
        }}
        cities={cities.map((c) => ({ id: c.id, name: c.name, state: c.state }))}
      />
    </div>
  );
}
