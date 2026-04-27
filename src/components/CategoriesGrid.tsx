import Link from "next/link";
import { categories } from "@/data/categories";
import CategoryCard from "./CategoryCard";

export default function CategoriesGrid() {
  return (
    <section className="py-16 md:py-20 bg-shaadi-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Wedding{" "}
            <span className="bg-gradient-to-r from-shaadi-red to-shaadi-rose bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Everything you need to plan your dream wedding, all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-shaadi-red border-2 border-shaadi-red/20 rounded-lg hover:bg-shaadi-light transition-colors"
          >
            View All Categories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
