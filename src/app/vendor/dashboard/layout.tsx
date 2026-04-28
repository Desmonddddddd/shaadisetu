import Link from "next/link";
import { redirect } from "next/navigation";
import { getOptionalVendorSession } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sess = await getOptionalVendorSession();
  if (!sess) redirect("/vendor/login");
  if (sess.status !== "active" || !sess.vendorId) redirect("/vendor/pending");

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
      <aside className="space-y-1">
        <h2 className="text-xs uppercase text-slate-500 mb-2">Vendor</h2>
        <NavLink href="/vendor/dashboard">Overview</NavLink>
        <NavLink href="/vendor/dashboard/enquiries">Enquiries</NavLink>
        <NavLink href="/vendor/dashboard/profile">Profile</NavLink>
        <NavLink href="/vendor/dashboard/portfolio">Portfolio</NavLink>
        <NavLink href="/vendor/dashboard/packages">Packages</NavLink>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="block text-sm text-slate-500 mt-4 hover:text-shaadi-deep"
          >
            Sign out
          </button>
        </form>
      </aside>
      <section>{children}</section>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-sm text-slate-700 px-2 py-1.5 rounded hover:bg-shaadi-light"
    >
      {children}
    </Link>
  );
}
