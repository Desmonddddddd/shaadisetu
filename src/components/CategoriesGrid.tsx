import Link from "next/link";
import { categories } from "@/data/categories";
import CategoryCard from "./CategoryCard";

export default function CategoriesGrid() {
  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="eyebrow"><span className="eyebrow-num">01</span>The Marketplace</p>
          <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl text-ink mt-4">
            Wedding <span className="italic text-bordeaux">Categories</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="block w-12 h-px bg-champagne" />
            <span className="text-champagne text-sm">◆</span>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <p className="mt-6 text-ink-soft max-w-xl mx-auto leading-relaxed font-light">
            Every craft your celebration calls for, gathered in one place — from
            the photograph that will outlast a generation to the lehenga that becomes legend.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/categories" className="btn-editorial-ghost">
            View All Categories
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
