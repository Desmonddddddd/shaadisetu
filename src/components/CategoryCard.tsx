import { Category } from "@/data/categories";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <button className="group p-6 bg-white rounded-xl border border-gray-100 hover:border-shaadi-pink shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left w-full">
      <div className="text-4xl mb-3">{category.emoji}</div>
      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-shaadi-red transition-colors">
        {category.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500 leading-relaxed">
        {category.description}
      </p>
    </button>
  );
}
