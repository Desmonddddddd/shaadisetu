"use client";

import { useState } from "react";
import Link from "next/link";
import { weddingFunctions } from "@/data/functions";
import { getCategoryById } from "@/data/categories";

export default function FunctionsPage() {
  const [activeFunction, setActiveFunction] = useState<string | null>(null);

  return (
    <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-shaadi-red via-shaadi-rose to-shaadi-pink" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Browse by Function
          </h1>
          <p className="mt-3 text-rose-100 text-base md:text-lg max-w-xl mx-auto">
            Every wedding function needs different vendors. Pick your event and
            see exactly what you need.
          </p>
        </div>
      </div>

      {/* Functions Grid */}
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {weddingFunctions.map((fn) => {
            const isActive = activeFunction === fn.id;
            const categories = fn.categoryIds
              .map((id) => getCategoryById(id))
              .filter(Boolean);

            return (
              <div key={fn.id} className="flex flex-col">
                {/* Function card */}
                <button
                  onClick={() =>
                    setActiveFunction(isActive ? null : fn.id)
                  }
                  className={`text-left bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${
                    isActive
                      ? "border-shaadi-rose ring-2 ring-shaadi-rose/20 shadow-lg"
                      : "border-gray-100 hover:-translate-y-0.5"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{fn.emoji}</span>
                      <span className="text-xs text-slate-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        {fn.categoryIds.length} categories
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {fn.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                      {fn.description}
                    </p>

                    {/* Category previews */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {categories.map(
                        (cat) =>
                          cat && (
                            <span
                              key={cat.id}
                              className="inline-flex items-center gap-1 text-xs text-slate-500 bg-gray-50 px-2 py-1 rounded-md"
                            >
                              <span className="text-sm">{cat.emoji}</span>
                              {cat.name.split(" ")[0]}
                            </span>
                          )
                      )}
                    </div>

                    {/* Expand indicator */}
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-shaadi-red">
                      {isActive ? "Hide vendors" : "View vendors"}
                      <svg
                        className={`w-3 h-3 transition-transform ${
                          isActive ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expanded category list */}
                {isActive && (
                  <div className="mt-2 bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
                    {categories.map(
                      (cat) =>
                        cat && (
                          <Link
                            key={cat.id}
                            href={`/categories/${cat.id}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-shaadi-light/30 transition-colors"
                          >
                            <span className="text-xl">{cat.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800">
                                {cat.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {cat.subcategories.length} subcategories
                              </p>
                            </div>
                            <svg
                              className="w-4 h-4 text-slate-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="mt-12 bg-white rounded-xl border border-gray-100 p-6 text-center max-w-2xl mx-auto">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">Not sure where to start?</span>{" "}
            Try{" "}
            <Link href="/plan" className="font-semibold text-shaadi-red hover:underline">
              Plan My Wedding
            </Link>{" "}
            for a personalized checklist based on your wedding date.
          </p>
        </div>
      </div>
    </section>
  );
}
