import { notFound } from "next/navigation";
import { requireVendorSession } from "@/lib/auth/session";
import { getEnquiryForVendor } from "@/lib/queries/enquiries";
import { markEnquiryRead, markEnquiryStatus } from "@/lib/actions/enquiries";

export default async function EnquiryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { vendorId } = await requireVendorSession();
  const enquiry = await getEnquiryForVendor(id, vendorId);
  if (!enquiry) notFound();
  if (!enquiry.readAt) await markEnquiryRead(id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Enquiry from {enquiry.name}</h1>

      <dl className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        <Row label="Phone">{enquiry.phone}</Row>
        <Row label="Event date">{enquiry.eventDate}</Row>
        <Row label="Event type">{enquiry.eventType}</Row>
        <Row label="Requirements">{enquiry.requirements}</Row>
        <Row label="Status">{enquiry.status}</Row>
        <Row label="Received">{new Date(enquiry.createdAt).toLocaleString()}</Row>
      </dl>

      <div className="flex flex-wrap gap-2">
        {(["contacted", "booked", "declined"] as const).map((next) => (
          <form
            key={next}
            action={async () => {
              "use server";
              await markEnquiryStatus(id, next);
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-shaadi-deep text-white capitalize"
            >
              Mark {next}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3">
      <dt className="text-xs uppercase text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-800">{children}</dd>
    </div>
  );
}
