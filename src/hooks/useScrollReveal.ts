"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-reveal hook using IntersectionObserver.
 * Finds all `.scroll-reveal` elements inside the container ref
 * and adds `.is-visible` when they enter viewport.
 *
 * Supports staggered delays via `data-delay="100"` attribute (ms).
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const elements = container.querySelectorAll(".scroll-reveal");
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.delay || "0", 10);

            if (delay > 0) {
              setTimeout(() => el.classList.add("is-visible"), delay);
            } else {
              el.classList.add("is-visible");
            }

            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}
