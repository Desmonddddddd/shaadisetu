import { db } from "@/lib/db";
import { requireVendorSession } from "@/lib/auth/session";
import { PortfolioEditor } from "./PortfolioEditor";

export const dynamic = "force-dynamic";

export default async function VendorPortfolioPage() {
  const { vendorId } = await requireVendorSession();
  const [vendor, images] = await Promise.all([
    db.vendor.findUnique({
      where: { id: vendorId },
      select: { coverImage: true },
    }),
    db.portfolioImage.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
      select: { id: true, url: true, caption: true, eventType: true },
    }),
  ]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-1">Portfolio</h1>
      <p className="text-sm text-slate-600 mb-4">
        Upload images of past work. The cover image appears on your listing card and profile hero.
      </p>
      <PortfolioEditor
        initialItems={images}
        initialCover={vendor?.coverImage ?? null}
      />
    </div>
  );
}
