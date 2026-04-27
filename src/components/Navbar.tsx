import Link from "next/link";
import CitySearch from "./CitySearch";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink bg-clip-text text-transparent">
              ShaadiSetu
            </span>
          </Link>

          {/* Desktop: City Search */}
          <div className="hidden md:block w-64">
            <CitySearch />
          </div>

          {/* Desktop: Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 hover:text-shaadi-red transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-slate-700 hover:text-shaadi-red transition-colors"
            >
              Blog
            </Link>
            <button className="px-5 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink hover:opacity-90 transition-opacity shadow-sm">
              List Your Business
            </button>
          </nav>

          {/* Mobile: Hamburger */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
