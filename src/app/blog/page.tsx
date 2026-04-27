"use client";

import { useState } from "react";
import BlogHero from "@/components/BlogHero";
import BlogCard from "@/components/BlogCard";
import { blogPosts, blogCategories, BlogCategory } from "@/data/blogs";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");

  const filteredPosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <>
      <BlogHero />

      <section className="py-12 md:py-16 bg-shaadi-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {blogCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-shaadi-red to-shaadi-rose text-white border-transparent shadow-md"
                    : "bg-white text-slate-700 border-gray-200 hover:border-shaadi-pink hover:text-shaadi-red"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No articles found in this category yet. Check back soon!
            </p>
          )}
        </div>
      </section>
    </>
  );
}
