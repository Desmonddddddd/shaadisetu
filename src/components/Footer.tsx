import Link from "next/link";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  Explore: [
    { label: "Vendors", href: "/vendors" },
    { label: "Functions", href: "/functions" },
    { label: "Client Diaries", href: "/client-diaries" },
    { label: "Become Pro", href: "/membership" },
  ],
  Connect: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "YouTube", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="h-px bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          {/* Brand */}
          <div>
            <span className="text-2xl font-bold font-[family-name:var(--font-cormorant)] bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink bg-clip-text text-transparent">
              ShaadiSetu
            </span>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              India&apos;s most trusted wedding planning platform. Find the best vendors for your dream wedding.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold text-white uppercase tracking-[0.15em] mb-5">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-shaadi-pink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; 2026 ShaadiSetu. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-shaadi-pink transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-shaadi-pink transition-colors">Terms</Link>
            <Link href="#" className="hover:text-shaadi-pink transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
