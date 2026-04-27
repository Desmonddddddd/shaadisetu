import Link from "next/link";
import { Category } from "@/data/categories";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.id}`}
      className={`group p-6 bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left w-full block ${
        category.highlight
          ? "border-amber-200 hover:border-amber-300"
          : "border-gray-100 hover:border-shaadi-pink"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="text-4xl mb-3">{category.emoji}</div>
        {category.highlight && (
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase">
            {category.highlight}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-shaadi-red transition-colors">
        {category.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500 leading-relaxed">
        {category.description}
      </p>
      <p className="mt-2 text-xs text-slate-400">
        {category.subcategories.length} subcategories
      </p>
    </Link>
  );
}
