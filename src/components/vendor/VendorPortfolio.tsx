"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import type { PortfolioImage } from "@/data/portfolio";

export function VendorPortfolio({ images }: { images: PortfolioImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Portfolio</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className="relative aspect-square overflow-hidden rounded-lg bg-shaadi-light"
            aria-label={`Open ${img.caption}`}
          >
            <Image
              src={img.url}
              alt={img.caption}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform"
            />
            <span className="absolute top-1 right-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded uppercase">
              {img.eventType}
            </span>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div className="relative w-full max-w-3xl aspect-[4/3]">
            <Image
              src={images[active].url}
              alt={images[active].caption}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
