import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { CityProvider } from "@/context/CityContext";
import { CompareProvider } from "@/context/CompareContext";
import { CompareTray } from "@/components/compare/CompareTray";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrackOfTheDay from "@/components/TrackOfTheDay";
import SaathiChat from "@/components/SaathiChat";
import { getOptionalUserSession } from "@/lib/auth/session";
import "./globals.css";

function initialsFrom(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "ShaadiSetu — Your Perfect Wedding, One Click Away",
  description: "Discover the best wedding vendors, venues, and services across India",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getOptionalUserSession();
  const userInitials = session ? initialsFrom(session.name, session.email) : null;
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} ${cormorant.variable} font-[family-name:var(--font-geist)] antialiased bg-white text-slate-900`}>
        <CityProvider>
          <CompareProvider>
            <Navbar userInitials={userInitials} />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CompareTray />
            <TrackOfTheDay />
            <SaathiChat />
          </CompareProvider>
        </CityProvider>
      </body>
    </html>
  );
}
