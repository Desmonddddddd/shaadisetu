import { Suspense } from "react";
import { db } from "@/lib/db";
import { searchVendors } from "@/lib/queries/search";
import { getOptionalUserSession } from "@/lib/auth/session";
import { getSavedVendors } from "@/lib/queries/saved";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";
import { SectionDivider } from "@/components/editorial/SectionDivider";
import { VendorEditorialGrid } from "@/components/vendor/VendorEditorialGrid";
import { VendorsControls } from "./VendorsControls";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Vendors — ShaadiSetu",
  description:
    "Browse hand-vetted Indian wedding vendors by city, category, or search. Photographers, venues, decor, attire, and more.",
};

interface SearchParams {
  q?: string;
  city?: string;
  category?: string;
}

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const cityId = (sp.city ?? "").trim();
  const categoryId = (sp.category ?? "").trim();

  const [vendors, cities, categories, userSess] = await Promise.all([
    searchVendors({
      q: q || undefined,
      cityId: cityId || undefined,
      categoryId: categoryId || undefined,
      limit: 60,
    }),
    db.city.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    getOptionalUserSession(),
  ]);

  const savedVendorIds = userSess
    ? (await getSavedVendors(userSess.userId)).map((s) => s.vendor.id)
    : [];

  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-95"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-14 md:py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              The Directory
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            Find your <span className="italic text-champagne">people.</span>
          </h1>
          <p className="fade-up stagger-2 mt-4 text-cream/80 max-w-xl mx-auto leading-relaxed font-light text-sm md:text-base">
            A hand-vetted directory of India&apos;s finest wedding artisans.
          </p>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="py-8 md:py-10 border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-6">
          <Suspense fallback={<ControlsSkeleton />}>
            <VendorsControls
              cities={cities}
              categories={categories}
              initialQuery={q}
              initialCity={cityId}
              initialCategory={categoryId}
              totalCount={vendors.length}
            />
          </Suspense>
        </div>
      </section>

      {/* GRID */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-6">
          <VendorEditorialGrid
            vendors={vendors}
            isAuthed={!!userSess}
            savedVendorIds={savedVendorIds}
          />

          {vendors.length > 0 && (
            <div className="mt-20 text-center">
              <SectionDivider />
              <p className="mt-6 text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft">
                Showing the {vendors.length} most relevant results.
                <br />
                Refine your filters above to narrow the field.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ControlsSkeleton() {
  return (
    <div className="space-y-7">
      <div className="h-12 skeleton-shimmer" />
      <div className="h-8 skeleton-shimmer w-3/4" />
      <div className="h-8 skeleton-shimmer w-2/3" />
    </div>
  );
}
