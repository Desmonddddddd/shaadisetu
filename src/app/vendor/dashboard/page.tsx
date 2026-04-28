import Link from "next/link";
import { requireVendorSession } from "@/lib/auth/session";
import { getUnreadCountForVendor } from "@/lib/queries/enquiries";
import { db } from "@/lib/db";

export default async function DashboardOverview() {
  const { vendorId } = await requireVendorSession();
  const [unread, vendor] = await Promise.all([
    getUnreadCountForVendor(vendorId),
    db.vendor.findUnique({ where: { id: vendorId }, select: { name: true } }),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back, {vendor?.name}
        </h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/vendor/dashboard/enquiries"
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-shaadi-deep"
        >
          <div className="text-sm text-slate-500">Unread enquiries</div>
          <div className="text-3xl font-semibold text-shaadi-deep mt-1">{unread}</div>
        </Link>
        <Link
          href="/vendor/dashboard/profile"
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-shaadi-deep"
        >
          <div className="text-sm text-slate-500">Profile</div>
          <div className="text-base text-slate-700 mt-1">Edit name, description, tags</div>
        </Link>
        <Link
          href="/vendor/dashboard/packages"
          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-shaadi-deep"
        >
          <div className="text-sm text-slate-500">Packages</div>
          <div className="text-base text-slate-700 mt-1">Add or edit pricing tiers</div>
        </Link>
      </div>
    </div>
  );
}
