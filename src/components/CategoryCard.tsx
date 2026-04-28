import Link from "next/link";
import { Category } from "@/data/categories";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.id}`}
      className="group editorial-card p-8 text-left w-full block relative"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-3xl opacity-70 group-hover:opacity-100 transition-opacity">{category.emoji}</span>
        {category.highlight && (
          <span className="text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-bordeaux">
            · {category.highlight} ·
          </span>
        )}
      </div>
      <h3 className="font-serif-display text-2xl text-ink group-hover:text-bordeaux transition-colors leading-tight">
        {category.name}
      </h3>
      <span className="block w-8 h-px bg-champagne mt-3 group-hover:w-16 transition-all duration-500" />
      <p className="mt-4 text-sm text-ink-soft leading-relaxed font-light">
        {category.description}
      </p>
      <p className="mt-6 text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft/60">
        {category.subcategories.length} Subcategories
      </p>
    </Link>
  );
}
