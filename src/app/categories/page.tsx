import { categories } from "@/data/categories";
import { CATEGORY_COVERS } from "@/data/categoryCovers";
import { CategoriesGallery } from "./CategoriesGallery";

export const metadata = {
  title: "All Categories — ShaadiSetu",
  description:
    "Eighteen hand-curated wedding vendor categories — venues, decor, catering, photography, attire, beauty, and more. Find the right pros for every part of your wedding.",
};

export default function CategoriesPage() {
  // Pre-attach cover images so the client island stays purely presentational.
  const enriched = categories.map((c) => ({
    id: c.id,
    name: c.name,
    emoji: c.emoji,
    description: c.description,
    highlight: c.highlight ?? null,
    subcategoryCount: c.subcategories.length,
    filterCount: c.filters.length,
    cover: CATEGORY_COVERS[c.id] ?? CATEGORY_COVERS.venues,
  }));

  const totalSubcategories = categories.reduce(
    (sum, c) => sum + c.subcategories.length,
    0,
  );
  const totalFilters = categories.reduce((sum, c) => sum + c.filters.length, 0);

  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              The Full Index
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            Every category. <span className="italic text-champagne">In one place.</span>
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/80 max-w-2xl mx-auto leading-relaxed font-light text-sm md:text-base">
            Eighteen master categories of wedding vendors. Search by name, scan
            by visual, click through to a curated list of pros in your city.
          </p>
        </div>
      </section>

      {/* GALLERY (client island) */}
      <CategoriesGallery
        items={enriched}
        totalCategories={categories.length}
        totalSubcategories={totalSubcategories}
        totalFilters={totalFilters}
      />
    </main>
  );
}
