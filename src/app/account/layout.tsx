import Link from "next/link";
import { getOptionalUserSession } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/auth";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const sess = await getOptionalUserSession();

  if (!sess) {
    // Public account pages (login, signup) render without sidebar/auth.
    return <>{children}</>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
      <aside className="space-y-1">
        <h2 className="text-xs uppercase text-slate-500 mb-2">Account</h2>
        <p className="text-sm text-slate-700 px-2 mb-3 truncate">
          {sess.name ?? sess.email}
        </p>
        <NavLink href="/account/saved">Saved vendors</NavLink>
        <NavLink href="/account/enquiries">My enquiries</NavLink>
        <NavLink href="/account/budget">Budget</NavLink>
        <NavLink href="/account/wedding">Microsite</NavLink>
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
