import { notFound } from "next/navigation";
import { sampleVendors } from "@/data/vendors";
import { portfolioByVendor } from "@/data/portfolio";
import { packagesByVendor } from "@/data/packages";
import { reviewsByVendor } from "@/data/reviews";
import { bookedDatesByVendor } from "@/data/availability";
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
  const vendor = sampleVendors.find((v) => v.id === id);
  if (!vendor) notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <div className="space-y-8 min-w-0">
        <VendorProfileHero vendor={vendor} />
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">About</h2>
          <p className="text-slate-700">{vendor.description}</p>
        </section>
        <VendorPortfolio images={portfolioByVendor[vendor.id] ?? []} />
        <VendorServicesList vendor={vendor} />
        <VendorPackages packages={packagesByVendor[vendor.id] ?? []} />
        <VendorAvailabilityCalendar bookedDates={bookedDatesByVendor[vendor.id] ?? []} />
        <VendorReviews reviews={reviewsByVendor[vendor.id] ?? []} />
      </div>
      <VendorEnquiryRail vendor={vendor} />
    </main>
  );
}
