import { BlogPost } from "@/data/blogs";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-shaadi-pink shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Placeholder image */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-4xl opacity-30">📸</span>
      </div>

      <div className="p-5">
        {/* Category tag */}
        <span className="inline-block px-3 py-1 text-xs font-semibold text-shaadi-red bg-shaadi-light rounded-full">
          {post.category}
        </span>

        <h3 className="mt-3 text-lg font-semibold text-slate-800 group-hover:text-shaadi-red transition-colors leading-snug line-clamp-2">
          {post.title}
        </h3>

        <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}
