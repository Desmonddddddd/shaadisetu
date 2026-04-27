import Link from "next/link";

const footerLinks = {
  About: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  Categories: [
    { label: "Bridal Wear", href: "#" },
    { label: "Venues", href: "#" },
    { label: "Photography", href: "#" },
    { label: "Catering", href: "#" },
    { label: "Makeup Artists", href: "#" },
    { label: "Decorators", href: "#" },
  ],
  "Popular Cities": [
    { label: "Delhi", href: "#" },
    { label: "Mumbai", href: "#" },
    { label: "Jaipur", href: "#" },
    { label: "Bangalore", href: "#" },
    { label: "Hyderabad", href: "#" },
    { label: "Kolkata", href: "#" },
  ],
  Connect: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Pinterest", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="h-1 bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink bg-clip-text text-transparent">
              ShaadiSetu
            </span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              India&apos;s most trusted wedding planning platform. Find the best vendors for your dream wedding.
            </p>
          </div>
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {heading}
              </h3>
              <ul className="space-y-2">
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
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2026 ShaadiSetu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
