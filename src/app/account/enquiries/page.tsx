import Link from "next/link";
import { requireUserSession } from "@/lib/auth/session";
import { getUserEnquiries } from "@/lib/queries/saved";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  new: "Pending",
  contacted: "Contacted",
  booked: "Booked",
  declined: "Declined",
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-amber-50 text-amber-700",
  contacted: "bg-blue-50 text-blue-700",
  booked: "bg-green-50 text-green-700",
  declined: "bg-gray-100 text-gray-600",
};

export default async function MyEnquiriesPage() {
  const { userId } = await requireUserSession();
  const enquiries = await getUserEnquiries(userId);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-4">My enquiries</h1>
      {enquiries.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-3">No enquiries yet.</p>
          <Link href="/vendors" className="text-shaadi-deep underline text-sm">
            Find vendors
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {enquiries.map((e) => {
            const styles = STATUS_STYLES[e.status] ?? "bg-gray-100 text-gray-600";
            const label = STATUS_LABELS[e.status] ?? e.status;
            return (
              <li
                key={e.id}
                className="border border-gray-100 rounded-lg p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/vendors/v/${e.vendor.id}`}
                    className="font-medium text-slate-900 hover:text-shaadi-deep"
                  >
                    {e.vendor.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {e.vendor.city.name} · {e.eventType} · {e.eventDate}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Sent {new Date(e.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${styles} shrink-0`}>{label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
