"use client";

import Link from "next/link";
import type { Vendor } from "@/types/vendor";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface VendorCard {
  vendor: Vendor;
  categoryName: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating);
        const half = !filled && star - 0.5 <= rating;
        return (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${filled || half ? "text-amber-400" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

export function TopVendorsClient({ vendors }: { vendors: VendorCard[] }) {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-shaadi-rose mb-3">
            Handpicked for You
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-cormorant)] text-slate-900">
            Our Top Trusted Vendors
          </h2>
          <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto">
            Verified professionals with outstanding reviews, handpicked by ShaadiSetu to make your wedding flawless.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map(({ vendor, categoryName }, i) => (
            <div
              key={vendor.id}
              className="scroll-reveal group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover"
              data-delay={i * 100}
            >
              <div className="h-px bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink" />

              <div className="p-6">
                <div className="flex items-start gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {vendor.name}
                      </h3>
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{categoryName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={vendor.rating} />
                  <span className="text-sm font-bold text-slate-800">{vendor.rating}</span>
                  <span className="text-xs text-slate-400">({vendor.reviewCount} reviews)</span>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">
                  {vendor.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vendor.city.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {vendor.yearsExperience} yrs exp
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {vendor.tags.map((tag) => (
                    <span key={tag} className="text-[11px] text-slate-500 bg-gray-50 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-50">
                  <Link
                    href={`/vendors/v/${vendor.id}`}
                    className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-shaadi-red to-shaadi-rose hover:from-shaadi-deep hover:to-shaadi-red transition-all"
                  >
                    Send Enquiry
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center scroll-reveal" data-delay="200">
          <Link
            href="/vendors"
            className="btn-arrow inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-shaadi-red border-2 border-shaadi-red rounded-full hover:bg-shaadi-red hover:text-white transition-colors"
          >
            View All Vendors
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
