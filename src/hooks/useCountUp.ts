"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` when the element scrolls into view.
 * Returns [ref, displayValue].
 *
 * - `target`: the final number (e.g. 50000)
 * - `duration`: animation length in ms (default 2000)
 * - `formatter`: optional function to format the number for display
 */
export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: number,
  duration = 2000,
  formatter?: (n: number) => string
): [React.RefObject<T | null>, string] {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  // Trigger on scroll into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  // Animate the count
  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [started, target, duration]);

  const display = formatter ? formatter(value) : value.toLocaleString("en-IN");
  return [ref, display];
}
