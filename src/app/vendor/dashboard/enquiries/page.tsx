import Link from "next/link";
import { requireVendorSession } from "@/lib/auth/session";
import { getInboxForVendor } from "@/lib/queries/enquiries";

export default async function InboxPage() {
  const { vendorId } = await requireVendorSession();
  const enquiries = await getInboxForVendor(vendorId);

  if (enquiries.length === 0) {
    return (
      <div className="py-16 text-center text-slate-600">
        No enquiries yet. They&apos;ll show up here when couples reach out.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold text-slate-900">Enquiries</h1>
      <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {enquiries.map((e) => (
          <li key={e.id}>
            <Link
              href={`/vendor/dashboard/enquiries/${e.id}`}
              className="block px-4 py-3 hover:bg-shaadi-light"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className={`text-sm ${e.unread ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                    {e.unread && <span className="text-shaadi-rose mr-1">●</span>}
                    {e.name} — {e.eventType} on {e.eventDate}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">{e.requirements}</div>
                </div>
                <div className="text-xs text-slate-400 capitalize">{e.status}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
