import { notFound } from "next/navigation";
import { getVendorProfile } from "@/lib/queries/vendors";
import { VendorProfileHero } from "@/components/vendor/VendorProfileHero";
import { VendorPortfolio } from "@/components/vendor/VendorPortfolio";
import { VendorPackages } from "@/components/vendor/VendorPackages";
import { VendorAvailabilityCalendar } from "@/components/vendor/VendorAvailabilityCalendar";
import { VendorReviews } from "@/components/vendor/VendorReviews";
import { VendorEnquiryRail } from "@/components/vendor/VendorEnquiryRail";
import { VendorServicesList } from "@/components/vendor/VendorServicesList";

export default async function VendorProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = await getVendorProfile(id);
  if (!vendor) notFound();

  const bookedDates = vendor.bookedDates.map((b) => b.date);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <div className="space-y-8 min-w-0">
        <VendorProfileHero vendor={vendor} stats={vendor.stats} />
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">About</h2>
          <p className="text-slate-700">{vendor.description}</p>
        </section>
        <VendorPortfolio images={vendor.portfolio} />
        <VendorServicesList vendor={vendor} />
        <VendorPackages packages={vendor.packages} />
        <VendorAvailabilityCalendar bookedDates={bookedDates} />
        <VendorReviews reviews={vendor.reviews} />
      </div>
      <VendorEnquiryRail vendor={vendor} />
    </main>
  );
}
